import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

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

export interface HydrationSettings {
  reminderFrequency: number; // minutes
  activeWindowStart: string; // "08:00"
  activeWindowEnd: string; // "20:00"
  tone: 'playful' | 'neutral';
  soundEnabled: boolean;
  dailySummary: boolean;
  dailyTarget: number;
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

const STORAGE_KEY = 'water_timeout_events_v1';
const SETTINGS_KEY = 'water_timeout_settings_v1';

const DEFAULT_SETTINGS: HydrationSettings = {
  reminderFrequency: 60,
  activeWindowStart: '08:00',
  activeWindowEnd: '20:00',
  tone: 'playful',
  soundEnabled: true,
  dailySummary: false,
  dailyTarget: 20,
};

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

function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

interface HydrationContextType {
  events: Record<string, HydrationEvent[]>;
  settings: HydrationSettings;
  addEvent: (unitType: UnitType) => Promise<void>;
  updateSettings: (settings: Partial<HydrationSettings>) => Promise<void>;
  clearHistory: () => Promise<void>;
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

  const addEvent = useCallback(async (unitType: UnitType) => {
    const newEvent: HydrationEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      unitType,
    };

    const dateKey = getDateKey();
    setEvents(prev => {
      const updated = { ...prev };
      if (!updated[dateKey]) {
        updated[dateKey] = [];
      }
      updated[dateKey] = [...updated[dateKey], newEvent];

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
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

  const getTodayPoints = useCallback(() => {
    const todayEvents = events[getDateKey()] || [];
    return todayEvents.reduce((sum, e) => sum + UNIT_VALUES[e.unitType], 0);
  }, [events]);

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
        totalPoints: dayEvents.reduce((sum, e) => sum + UNIT_VALUES[e.unitType], 0),
      });
    }
    return summaries;
  }, [events]);

  return (
    <HydrationContext.Provider
      value={{
        events,
        settings,
        addEvent,
        updateSettings,
        clearHistory,
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
