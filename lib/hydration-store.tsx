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
}

export type BottleMood = 'sad' | 'mild' | 'okay' | 'happy';
export type BottleType = 'classic' | 'slim' | 'sport' | 'square' | 'gallon' | 'soda' | 'cup' | 'barrel' | 'crystal' |
  'droplet' | 'zen' | 'cloud' | 'lotus' | 'pebble' | 'turtle' | 'whale' | 'moon' | 'plant';


export interface HydrationSettings {
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
  notificationSound: string;
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
  dailyTarget: 20,
  bottleType: 'classic',
  sipSizeML: 25,
  intakeUnit: 'points',
  bottleSizeML: 500,
  sipSizeOZ: 1,
  bottleSizeOZ: 16,
  notificationActions: ['quarter', 'half', 'full'],
  notificationSound: 'sound1',
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
  return date.toISOString().split('T')[0];
}

export async function logHydrationEvent(unitType: UnitType, eventId?: string) {
  const id = eventId || Math.random().toString(36).substring(7);
  const dateKey = getDateKey();

  try {
    const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
    const events: Record<string, HydrationEvent[]> = storedEvents ? JSON.parse(storedEvents) : {};

    // Check if event with this ID already exists (to prevent duplicate notification logs)
    if (eventId && events[dateKey]?.some(e => e.id === eventId)) {
      console.log(`[Hydration] Duplicate event ID detected: ${id}. Skipping.`);
      return;
    }

    const newEvent: HydrationEvent = {
      id,
      timestamp: Date.now(),
      unitType,
    };

    if (!events[dateKey]) {
      events[dateKey] = [];
    }
    events[dateKey] = [...events[dateKey], newEvent];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    console.log(`[Hydration] Successfully logged background event: ${unitType} (ID: ${id})`);
    return events;
  } catch (e) {
    console.error('[Hydration] Failed to log background event', e);
    throw e;
  }
}

interface HydrationContextType {
  events: Record<string, HydrationEvent[]>;
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
  const [events, setEvents] = useState<Record<string, HydrationEvent[]>>({});
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
          setEvents(JSON.parse(storedEvents));
        }
        if (storedSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
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
      scheduleHydrationReminders(
        settings.reminderFrequency,
        settings.activeWindowStart,
        settings.activeWindowEnd,
        settings.tone,
        settings.notificationSound
      ).catch(console.error);
    }
  }, [loading, settings.reminderFrequency, settings.activeWindowStart, settings.activeWindowEnd, settings.tone, settings.notificationSound]);

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
    const todayEvents = events[getDateKey()] || [];
    return todayEvents.reduce((sum, e) => sum + getUnitValue(e.unitType, settings), 0);
  }, [events, settings]);

  const getDailySummaries = useCallback((days: number = 14) => {
    const summaries: DailySummary[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getDateKey(date);
      const dayEvents = events[dateKey] || [];
      summaries.push({
        date: dateKey,
        events: dayEvents,
        totalPoints: dayEvents.reduce((sum, e) => sum + getUnitValue(e.unitType, settings), 0),
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
