import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const gallon: MascotDefinition = {
    type: 'gallon',
    name: 'Gallon',
    path: "M 40 60 L 110 60 L 115 150 Q 115 160 105 160 L 45 160 Q 35 160 40 150 Z",
    hasCap: true,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["I'm a big guy, I need lots of water!", "Feeling empty inside...", "Heavy and dry."],
        mild: ["Getting there, but I'm huge!", "Keep pouring!", "Fuel for the day!"],
        okay: ["Feeling strong!", "Hydration station!", "Steady flow!"],
        happy: ["Full tank!", "Unstoppable energy!", "I'm a hydration beast!"]
    }
};
