import React from "react";
import { MascotDefinition } from "../types";
import { StandardFace } from "./faces";

export const slim: MascotDefinition = {
  type: "slim",
  name: "Vogue",
  path: "M 65 30 Q 65 20 75 20 Q 85 20 85 30 L 85 50 Q 85 70 95 90 L 100 140 Q 105 160 75 160 Q 45 160 50 140 L 55 90 Q 65 70 65 50 Z",
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: ["I feel so hollow...", "Fill me up, darling.", "Needs more sparkle."],
    mild: ["Water is fashion.", "Sip in style.", "Elegant hydration."],
    okay: ["Looking good!", "Feeling fabulous.", "Stay chic!"],
    happy: [
      "Absolutely radiant!",
      "Hydration is the new black!",
      "Perfection!",
    ],
  },
};
