import React from "react";
import { MascotDefinition } from "../../types";
import { StandardFace } from "../faces";

export const barrel: MascotDefinition = {
  type: "barrel",
  name: "Carafe",
  category: "Classic",
  path: "M 65 30 L 85 30 L 85 80 C 115 100 115 140 85 160 L 65 160 C 35 140 35 100 65 80 Z",
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: ["A bit empty...", "Please refill.", "Waiting for water."],
    mild: ["A touch of water.", "Refreshing.", "Elegant sips."],
    okay: ["Half full, half amazing.", "Table ready.", "Lovely!"],
    happy: ["Dinner is served!", "Perfectly poured.", "Exquisite!"],
  },
};
