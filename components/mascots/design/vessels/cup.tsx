import React from "react";
import { MascotDefinition } from "../../types";
import { StandardFace } from "../faces";

export const cup: MascotDefinition = {
  type: "cup",
  name: "Cup",
  category: "Vessels",
  path: "M 45 40 L 105 40 L 95 150 Q 95 160 85 160 L 65 160 Q 55 160 55 150 Z",
  hasCap: false,
  show: true,
  renderFace: (mood) => <StandardFace mood={mood} />,
  dialogues: {
    sad: ["Half empty...", "Just a sip?", "Thirsty cup!"],
    mild: ["Warm welcome to water!", "Fill me up!", "Cheers!"],
    okay: ["Half full!", "Great progress!", "Refreshing!"],
    happy: ["Full to the brim!", "Overjoyed!", "Perfect hydration!"],
  },
};
