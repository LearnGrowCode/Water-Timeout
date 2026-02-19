export type UnitType = "sip" | "quarter" | "half" | "full";

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

export type BottleMood = "sad" | "mild" | "okay" | "happy";

export type BottleType =
  | "classic"
  | "slim"
  | "sport"
  | "square"
  | "gallon"
  | "soda"
  | "cup"
  | "barrel"
  | "crystal"
  | "droplet"
  | "zen"
  | "cloud"
  | "lotus"
  | "pebble"
  | "turtle"
  | "whale"
  | "moon"
  | "plant";

export interface HydrationSettings {
  remindersEnabled: boolean;
  reminderFrequency: number; // minutes
  activeWindowStart: string; // "08:00"
  activeWindowEnd: string; // "20:00"
  tone: "playful" | "neutral";
  soundEnabled: boolean;
  dailySummary: boolean;
  dailyTarget: number;
  bottleType: BottleType;
  sipSizeML: number;
  intakeUnit: "points" | "ml" | "oz";
  bottleSizeML: number;
  sipSizeOZ: number;
  bottleSizeOZ: number;
  notificationActions: UnitType[];
  timeFormat: "12h" | "24h";
  theme: "light" | "dark" | "system";
  soundOverrideEnabled: boolean;
}

export const UNIT_VALUES: Record<UnitType, number> = {
  sip: 1,
  quarter: 2,
  half: 3,
  full: 4,
};

export const UNIT_LABELS: Record<UnitType, string> = {
  sip: "Sip",
  quarter: "¼ Bottle",
  half: "½ Bottle",
  full: "Full Bottle",
};

export const UNIT_EMOJIS: Record<UnitType, string> = {
  sip: "💧",
  quarter: "🥤",
  half: "🍶",
  full: "🫗",
};

export const STORAGE_KEY = "water_timeout_events_v1";
export const SETTINGS_KEY = "water_timeout_settings_v1";

export const DEFAULT_SETTINGS: HydrationSettings = {
  reminderFrequency: 60,
  activeWindowStart: "08:00",
  activeWindowEnd: "20:00",
  tone: "playful",
  soundEnabled: true,
  dailySummary: false,
  dailyTarget: 2000,
  bottleType: "droplet",
  sipSizeML: 25,
  intakeUnit: "ml",
  bottleSizeML: 500,
  sipSizeOZ: 1,
  bottleSizeOZ: 16,
  notificationActions: ["quarter", "half", "full"],
  remindersEnabled: true,
  timeFormat: "12h",
  theme: "system",
  soundOverrideEnabled: false,
};
