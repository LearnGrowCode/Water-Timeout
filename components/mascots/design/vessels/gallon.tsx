import React from "react";
import { MascotDefinition } from "../../types";
import { StandardFace } from "../faces";

export const gallon: MascotDefinition = {
  type: "gallon",
  name: "Gym Beast",
  category: "Vessels",
  path: "M 45 40 L 105 40 L 115 60 L 115 150 L 105 160 L 45 160 L 35 150 L 35 60 Z",
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: ["Even beasts need water!", "Muscles are dry...", "Fuel me up!"],
    mild: ["Warming up!", "Getting heavier!", "Lift and sip!"],
    okay: ["Strong hydration!", "Feeling the pump!", "Solid gains!"],
    happy: ["BEAST MODE!", "Maximum hydration!", "Unstoppable!"],
  },
};
