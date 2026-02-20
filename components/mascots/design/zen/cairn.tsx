import React from "react";
import { MascotDefinition } from "../../types";
import { ZenFace } from "../faces";

export const cairn: MascotDefinition = {
  type: "cairn",
  name: "Cairn",
  category: "Zen",
  path: "M 60 40 Q 75 35 90 40 Q 95 50 75 55 Q 55 50 60 40 M 50 70 Q 75 60 100 70 Q 110 90 75 100 Q 40 90 50 70 M 40 120 Q 75 105 110 120 Q 120 145 75 160 Q 30 145 40 120",
  colors: ["#94A3B8", "#475569"],
  hasCap: false,
  show: true,
  renderFace: (mood) => <ZenFace mood={mood} />,
  dialogues: {
    sad: ["Finding my center...", "Unbalanced.", "Seeking ground."],
    mild: ["Stabilizing.", "Each drop helps.", "A calm foundation."],
    okay: ["Balanced hydration!", "Standing tall.", "Serene and steady."],
    happy: ["Perfectly centered!", "Absolute harmony!", "A mountain of peace!"],
  },
};
