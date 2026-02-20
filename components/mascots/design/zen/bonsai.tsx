import React from "react";
import { MascotDefinition } from "../../types";
import { ZenFace } from "../faces";

export const bonsai: MascotDefinition = {
  type: "bonsai",
  name: "Bonsai",
  category: "Zen",
  path: "M 55 130 L 95 130 L 105 150 Q 105 160 95 160 L 55 160 Q 45 160 45 150 Z M 75 130 L 75 100 M 50 80 Q 75 50 100 80 Q 110 120 75 120 Q 40 120 50 80",
  colors: ["#4ade80", "#16a34a"],
  hasCap: false,
  show: true,
  renderFace: (mood) => <ZenFace mood={mood} />,
  dialogues: {
    sad: ["Wilting...", "Parched soil.", "Need morning dew."],
    mild: ["Roots drinking.", "Reaching for light.", "Steady growth."],
    okay: ["Lush and green!", "Pruned and hydrated!", "Ancient wisdom."],
    happy: [
      "Full bloom joy!",
      "A masterpiece of life!",
      "The garden is peaceful!",
    ],
  },
};
