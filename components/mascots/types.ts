import { ReactNode } from "react";
import { BottleMood, BottleType } from "../../lib/hydration-store";

export type MascotCategory = "Classic" | "Nature" | "Vessels" | "Zen";

export interface MascotDefinition {
  type: BottleType;
  name: string;
  path: string;
  category: MascotCategory;
  colors?: [string, string]; // [start, end]
  hasCap?: boolean;
  show: boolean;
  renderFace: (mood: BottleMood) => ReactNode;
  dialogues: Record<BottleMood, string[]>;
}
