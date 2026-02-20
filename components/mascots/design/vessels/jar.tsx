import React from "react";
import { MascotDefinition } from "../../types";
import { StandardFace } from "../faces";

export const jar: MascotDefinition = {
  type: "jar",
  name: "Mason Jar",
  category: "Vessels",
  path: "M 50 40 L 100 40 L 105 50 L 105 150 Q 105 160 95 160 L 55 160 Q 45 160 45 150 L 45 50 Z",
  colors: ["#7DD3FC", "#38BDF8"],
  hasCap: true,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: ["Feeling empty.", "Just a little more?", "Low tide in the jar."],
    mild: ["Refreshing!", "Getting cooler.", "A clear choice."],
    okay: ["Half-way there!", "Deliciously clear.", "Feeling solid."],
    happy: [
      "Full and fresh!",
      "Mason would be proud!",
      "Crystal clear hydration!",
    ],
  },
};
