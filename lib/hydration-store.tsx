import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { scheduleHydrationReminders } from './notifications';

export type UnitType = 'sip' | 'quarter' | 'half' | 'full';

export interface HydrationEvent {
  id: string;
  timestamp: number;
  unitType: UnitType;
}

export interface DailySummary {
  date: string;
  events: HydrationEvent[];
  totalPoints: number;
  target: number;
}

export interface DayData {
  events: HydrationEvent[];
  target: number;
}

export type BottleMood = 'sad' | 'mild' | 'okay' | 'happy';
export type BottleType = 'classic' | 'slim' | 'sport' | 'square' | 'gallon' | 'soda' | 'cup' | 'barrel' | 'crystal' |
  'droplet' | 'zen' | 'cloud' | 'lotus' | 'pebble' | 'turtle' | 'whale' | 'moon' | 'plant';


export interface HydrationSettings {
  remindersEnabled: boolean;
  reminderFrequency: number; // minutes
  activeWindowStart: string; // "08:00"
  activeWindowEnd: string; // "20:00"
  tone: 'playful' | 'neutral';
  soundEnabled: boolean;
  dailySummary: boolean;
  dailyTarget: number;
  bottleType: BottleType;
  sipSizeML: number;
  intakeUnit: 'points' | 'ml' | 'oz';
  bottleSizeML: number;
  sipSizeOZ: number;
  bottleSizeOZ: number;
  notificationActions: UnitType[];
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
}

export const UNIT_VALUES: Record<UnitType, number> = {
  sip: 1,
  quarter: 2,
  half: 3,
  full: 4,
};

export const UNIT_LABELS: Record<UnitType, string> = {
  sip: 'Sip',
  quarter: '¼ Bottle',
  half: '½ Bottle',
  full: 'Full Bottle',
};

export const UNIT_EMOJIS: Record<UnitType, string> = {
  sip: '💧',
  quarter: '🥤',
  half: '🍶',
  full: '🫗',
};

export const STORAGE_KEY = 'water_timeout_events_v1';
export const SETTINGS_KEY = 'water_timeout_settings_v1';

const DEFAULT_SETTINGS: HydrationSettings = {
  reminderFrequency: 60,
  activeWindowStart: '08:00',
  activeWindowEnd: '20:00',
  tone: 'playful',
  soundEnabled: true,
  dailySummary: false,
  dailyTarget: 2000,
  bottleType: 'droplet',
  sipSizeML: 25,
  intakeUnit: 'ml',
  bottleSizeML: 500,
  sipSizeOZ: 1,
  bottleSizeOZ: 16,
  notificationActions: ['quarter', 'half', 'full'],
  remindersEnabled: true,
  timeFormat: '12h',
  theme: 'system',
};

export function getUnitValue(unit: UnitType, settings: HydrationSettings): number {
  if (settings.intakeUnit === 'ml') {
    switch (unit) {
      case 'sip': return settings.sipSizeML;
      case 'quarter': return settings.bottleSizeML * 0.25;
      case 'half': return settings.bottleSizeML * 0.5;
      case 'full': return settings.bottleSizeML;
      default: return 0;
    }
  }
  if (settings.intakeUnit === 'oz') {
    switch (unit) {
      case 'sip': return settings.sipSizeOZ;
      case 'quarter': return settings.bottleSizeOZ * 0.25;
      case 'half': return settings.bottleSizeOZ * 0.5;
      case 'full': return settings.bottleSizeOZ;
      default: return 0;
    }
  }
  return UNIT_VALUES[unit];
}

export function formatValue(value: number, unit: 'points' | 'ml' | 'oz'): string {
  if (unit === 'ml') {
    if (value >= 1000) {
      const liters = value / 1000;
      return `${liters % 1 === 0 ? liters : liters.toFixed(1)}L`;
    }
    return `${value}ml`;
  }
  return `${value} ${unit === 'points' ? 'pts' : 'fl oz'}`;
}

export function getBottleMood(totalPoints: number, target: number = 20): BottleMood {
  const percentage = totalPoints / target;
  if (percentage >= 0.8) return 'happy';
  if (percentage >= 0.5) return 'okay';
  if (percentage >= 0.2) return 'mild';
  return 'sad';
}

export function getMoodLabel(mood: BottleMood): string {
  switch (mood) {
    case 'happy': return 'Amazing! 🎉';
    case 'okay': return 'Great job! 👍';
    case 'mild': return 'Keep going! 💪';
    case 'sad': return 'Let\'s hydrate! 💧';
  }
}

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function logHydrationEvent(unitType: UnitType, eventId?: string) {
  const id = eventId || Math.random().toString(36).substring(7);
  const dateKey = getDateKey();

  try {
    const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
    const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    const settings: HydrationSettings = storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
    
    const rawEvents: Record<string, any> = storedEvents ? JSON.parse(storedEvents) : {};
    const events: Record<string, DayData> = {};

    // Get current day data and migrate if needed
    let todayData: DayData;
    const rawToday = rawEvents[dateKey];
    if (!rawToday) {
      todayData = { events: [], target: settings.dailyTarget };
    } else if (Array.isArray(rawToday)) {
      todayData = { events: rawToday, target: settings.dailyTarget };
    } else {
      todayData = rawToday as DayData;
    }

    // Check for duplicates
    if (eventId && todayData.events.some(e => e.id === eventId)) {
      console.log(`[Hydration] Duplicate event ID detected: ${id}. Skipping.`);
      return;
    }

    const newEvent: HydrationEvent = {
      id,
      timestamp: Date.now(),
      unitType,
    };

    todayData.events = [...todayData.events, newEvent];
    
    // Save all events back, maintaining object format for those already migrated or new
    // For simplicity, we can migrate everything here or just the active ones
    // We'll migrate the whole set to be safe
    Object.keys(rawEvents).forEach(key => {
      if (key === dateKey) {
        events[key] = todayData;
      } else if (Array.isArray(rawEvents[key])) {
        events[key] = { events: rawEvents[key], target: settings.dailyTarget }; // Fallback to current target for old data
      } else {
        events[key] = rawEvents[key];
      }
    });
    
    if (!events[dateKey]) events[dateKey] = todayData;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    console.log(`[Hydration] Successfully logged background event: ${unitType} (ID: ${id})`);
    return events;
  } catch (e) {
    console.error('[Hydration] Failed to log background event', e);
    throw e;
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
          Object.keys(rawEvents).forEach(key => {
            if (Array.isArray(rawEvents[key])) {
              migrated[key] = { events: rawEvents[key], target: DEFAULT_SETTINGS.dailyTarget };
            } else {
              migrated[key] = rawEvents[key];
            }
          });
          setEvents(migrated);
        }
        if (storedSettings) {
          setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
        }
      } catch (e) {
        console.error('Failed to load hydration data', e);
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
        ).catch(console.error);
      } else {
        import('./notifications').then(({ cancelAllNotifications }) => {
          cancelAllNotifications().catch(console.error);
        });
      }
    }
  }, [loading, settings.remindersEnabled, settings.reminderFrequency, settings.activeWindowStart, settings.activeWindowEnd, settings.tone]);

  const addEvent = useCallback(async (unitType: UnitType, eventId?: string) => {
    try {
      const updatedEvents = await logHydrationEvent(unitType, eventId);
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error('Failed to add event from UI', e);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<HydrationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(console.error);
      
      // If daily target changed, update today's recorded target too
      if (newSettings.dailyTarget !== undefined) {
        setEvents(prevEvents => {
          const todayKey = getDateKey();
          const todayData = prevEvents[todayKey] || { events: [], target: updated.dailyTarget };
          const updatedEvents = {
            ...prevEvents,
            [todayKey]: { ...todayData, target: updated.dailyTarget }
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
    setEvents(prev => {
      const updated = { ...prev };
      delete updated[todayKey];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const getTodayPoints = useCallback(() => {
    const todayData = events[getDateKey()] || { events: [], target: settings.dailyTarget };
    return todayData.events.reduce((sum, e) => sum + getUnitValue(e.unitType, settings), 0);
  }, [events, settings]);

  const getDailySummaries = useCallback((days: number = 14) => {
    const summaries: DailySummary[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const dayData = events[dateKey] || { events: [], target: settings.dailyTarget };
      summaries.push({
        date: dateKey,
        events: dayData.events,
        totalPoints: dayData.events.reduce((sum, e) => sum + getUnitValue(e.unitType, settings), 0),
        target: dayData.target,
      });
    }
    return summaries;
  }, [events, settings]);

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
    throw new Error('useHydration must be used within a HydrationProvider');
  }
  return context;
}
