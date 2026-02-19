import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DayData,
  DEFAULT_SETTINGS,
  HydrationEvent,
  HydrationSettings,
  SETTINGS_KEY,
  STORAGE_KEY,
  UnitType,
} from "./hydration-types";

export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function logHydrationEvent(unitType: UnitType, eventId?: string) {
  const id = eventId || Math.random().toString(36).substring(7);
  const dateKey = getDateKey();

  try {
    const [storedEvents, storedSettings] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(SETTINGS_KEY),
    ]);

    const settings: HydrationSettings = storedSettings
      ? JSON.parse(storedSettings)
      : DEFAULT_SETTINGS;

    const rawEvents: Record<string, DayData | HydrationEvent[]> = storedEvents
      ? JSON.parse(storedEvents)
      : {};
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
    if (eventId && todayData.events.some((e) => e.id === eventId)) {
      console.log(`[Hydration] Duplicate event ID detected: ${id}. Skipping.`);
      return;
    }

    const newEvent: HydrationEvent = {
      id,
      timestamp: Date.now(),
      unitType,
    };

    todayData.events = [...todayData.events, newEvent];

    // Migrate all events to new format if needed
    Object.keys(rawEvents).forEach((key) => {
      if (key === dateKey) {
        events[key] = todayData;
      } else if (Array.isArray(rawEvents[key])) {
        // Fallback to current target for old data
        events[key] = { events: rawEvents[key], target: settings.dailyTarget };
      } else {
        events[key] = rawEvents[key];
      }
    });

    if (!events[dateKey]) events[dateKey] = todayData;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    console.log(`[Hydration] Successfully logged event: ${unitType} (ID: ${id})`);
    return events;
  } catch (e) {
    console.error("[Hydration] Failed to log event", e);
    throw e;
  }
}
