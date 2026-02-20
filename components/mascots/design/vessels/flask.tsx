import React from "react";
import { MascotDefinition } from "../../types";
import { StandardFace } from "../faces";

export const flask: MascotDefinition = {
  type: "flask",
  name: "Flask",
  category: "Vessels",
  path: "M 70 40 L 80 40 L 80 80 L 115 150 Q 120 160 110 160 L 40 160 Q 30 160 35 150 L 70 80 Z",
  colors: ["#A5B4FC", "#6366F1"],
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: [
      "The experiment is failing...",
      "Need more solution!",
      "Critical level!",
    ],
    mild: ["Reactions starting.", "Level stabilizing.", "Analyzing intake."],
    okay: ["Perfect concentration.", "Successful mixture!", "Proceeding well."],
    happy: ["EUREKA!", "Maximum efficiency!", "The formula for hydration!"],
  },
};
