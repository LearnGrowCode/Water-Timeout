import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { getDateKey, logHydrationEvent } from "./hydration-logic";
import {
  type BottleMood,
  type BottleType,
  type DailySummary,
  type DayData,
  DEFAULT_SETTINGS,
  type HydrationEvent,
  type HydrationSettings,
  SETTINGS_KEY,
  STORAGE_KEY,
  UNIT_EMOJIS,
  UNIT_LABELS,
  UNIT_VALUES,
  type UnitType,
} from "./hydration-types";
import { cancelAllNotifications, scheduleHydrationReminders } from "./notifications";

export {
  type BottleMood,
  type BottleType,
  type DailySummary,
  type DayData,
  DEFAULT_SETTINGS,
  type HydrationEvent,
  type HydrationSettings,
  SETTINGS_KEY,
  STORAGE_KEY,
  UNIT_EMOJIS,
  UNIT_LABELS,
  UNIT_VALUES,
  type UnitType,
  getDateKey,
  logHydrationEvent,
};

export function getUnitValue(unit: UnitType, settings: HydrationSettings): number {
  if (settings.intakeUnit === "ml") {
    switch (unit) {
      case "sip":
        return settings.sipSizeML;
      case "quarter":
        return settings.bottleSizeML * 0.25;
      case "half":
        return settings.bottleSizeML * 0.5;
      case "full":
        return settings.bottleSizeML;
      default:
        return 0;
    }
  }
  if (settings.intakeUnit === "oz") {
    switch (unit) {
      case "sip":
        return settings.sipSizeOZ;
      case "quarter":
        return settings.bottleSizeOZ * 0.25;
      case "half":
        return settings.bottleSizeOZ * 0.5;
      case "full":
        return settings.bottleSizeOZ;
      default:
        return 0;
    }
  }
  return UNIT_VALUES[unit];
}

export function formatValue(value: number, unit: "points" | "ml" | "oz"): string {
  if (unit === "ml") {
    if (value >= 1000) {
      const liters = value / 1000;
      return `${liters % 1 === 0 ? liters : liters.toFixed(1)}L`;
    }
    return `${value}ml`;
  }
  return `${value} ${unit === "points" ? "pts" : "fl oz"}`;
}

export function getBottleMood(totalPoints: number, target: number = 20): BottleMood {
  const percentage = totalPoints / target;
  if (percentage >= 0.8) return "happy";
  if (percentage >= 0.5) return "okay";
  if (percentage >= 0.2) return "mild";
  return "sad";
}

export function getMoodLabel(mood: BottleMood): string {
  switch (mood) {
    case "happy":
      return "Amazing! 🎉";
    case "okay":
      return "Great job! 👍";
    case "mild":
      return "Keep going! 💪";
    case "sad":
      return "Let's hydrate! 💧";
  }
}

interface HydrationContextType {
  events: Record<string, DayData>;
  settings: HydrationSettings;
  addEvent: (unitType: UnitType, eventId?: string) => Promise<void>;
  updateSettings: (settings: Partial<HydrationSettings>) => Promise<void>;
  clearHistory: () => Promise<void>;
  resetToday: () => Promise<void>;
  getTodayPoints: () => number;
  getDailySummaries: (days?: number) => DailySummary[];
  loading: boolean;
}

interface HydrationContextType {
  events: Record<string, DayData>;
  settings: HydrationSettings;
  addEvent: (unitType: UnitType, eventId?: string) => Promise<void>;
  updateSettings: (settings: Partial<HydrationSettings>) => Promise<void>;
  clearHistory: () => Promise<void>;
  resetToday: () => Promise<void>;
  getTodayPoints: () => number;
  getDailySummaries: (days?: number) => DailySummary[];
  loading: boolean;
}

const HydrationContext = createContext<HydrationContextType | undefined>(undefined);

export function HydrationProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Record<string, DayData>>({});
  const [settings, setSettings] = useState<HydrationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [storedEvents, storedSettings] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
        ]);

        if (storedEvents) {
          const rawEvents = JSON.parse(storedEvents);
          const migrated: Record<string, DayData> = {};
          Object.keys(rawEvents).forEach((key) => {
            if (Array.isArray(rawEvents[key])) {
              migrated[key] = {
                events: rawEvents[key],
                target: DEFAULT_SETTINGS.dailyTarget,
              };
            } else {
              migrated[key] = rawEvents[key];
            }
          });
          setEvents(migrated);
        }
        if (storedSettings) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(storedSettings) }));
        }
      } catch (e) {
        console.error("Failed to load hydration data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (settings.remindersEnabled) {
        scheduleHydrationReminders(
          settings.reminderFrequency,
          settings.activeWindowStart,
          settings.activeWindowEnd,
          settings.tone,
          settings.soundOverrideEnabled,
        ).catch(console.error);
      } else {
        cancelAllNotifications().catch(console.error);
      }
    }
  }, [
    loading,
    settings.remindersEnabled,
    settings.reminderFrequency,
    settings.activeWindowStart,
    settings.activeWindowEnd,
    settings.tone,
    settings.soundOverrideEnabled,
  ]);

  const addEvent = useCallback(async (unitType: UnitType, eventId?: string) => {
    try {
      const updatedEvents = await logHydrationEvent(unitType, eventId);
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("Failed to add event from UI", e);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<HydrationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(console.error);

      // If daily target changed, update today's recorded target too
      if (newSettings.dailyTarget !== undefined) {
        setEvents((prevEvents) => {
          const todayKey = getDateKey();
          const todayData = prevEvents[todayKey] || {
            events: [],
            target: updated.dailyTarget,
          };
          const updatedEvents = {
            ...prevEvents,
            [todayKey]: { ...todayData, target: updated.dailyTarget },
          };
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents)).catch(console.error);
          return updatedEvents;
        });
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setEvents({});
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetToday = useCallback(async () => {
    const todayKey = getDateKey();
    setEvents((prev) => {
      const updated = { ...prev };
      delete updated[todayKey];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const getTodayPoints = useCallback(() => {
    const todayData = events[getDateKey()] || {
      events: [],
      target: settings.dailyTarget,
    };
    return todayData.events.reduce((sum, e) => sum + getUnitValue(e.unitType, settings), 0);
  }, [events, settings]);

  const getDailySummaries = useCallback(
    (days: number = 14) => {
      const summaries: DailySummary[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = getDateKey(date);
        const dayData = events[dateKey] || {
          events: [],
          target: settings.dailyTarget,
        };
        summaries.push({
          date: dateKey,
          events: dayData.events,
          totalPoints: dayData.events.reduce(
            (sum, e) => sum + getUnitValue(e.unitType, settings),
            0,
          ),
          target: dayData.target,
        });
      }
      return summaries;
    },
    [events, settings],
  );

  return (
    <HydrationContext.Provider
      value={{
        events,
        settings,
        addEvent,
        updateSettings,
        clearHistory,
        resetToday,
        getTodayPoints,
        getDailySummaries,
        loading,
      }}
    >
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  const context = useContext(HydrationContext);
  if (context === undefined) {
    throw new Error("useHydration must be used within a HydrationProvider");
  }
  return context;
}
