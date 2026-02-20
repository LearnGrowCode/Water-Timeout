import React from "react";

import { MascotDefinition } from "../types";
import { StandardFace } from "./faces";

export const classic: MascotDefinition = {
  type: "classic",
  name: "Classic",
  path: "M 40 40 L 110 40 L 110 150 Q 110 160 100 160 L 50 160 Q 40 160 40 150 Z",
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: [
      "I'm feeling a bit empty...",
      "A drop of water would be nice!",
      "Dry as a desert here!",
    ],
    mild: [
      "Getting there!",
      "A little more water, please?",
      "I can feel the flow!",
    ],
    okay: ["Feeling good!", "Hydration is key!", "Steady as she goes!"],
    happy: [
      "Perfectly hydrated!",
      "I'm overflowing with joy!",
      "Best day ever!",
    ],
  },
};
