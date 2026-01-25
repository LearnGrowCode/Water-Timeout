import React from 'react';
import { MascotDefinition } from '../types';
import { ZenFace } from './faces';

export const moon: MascotDefinition = {
    type: 'moon',
    name: 'Moon',
    path: "M 75 30 C 105 30 130 55 130 85 C 130 115 105 140 75 140 C 95 140 110 120 110 85 C 110 50 95 30 75 30 Z",
    colors: ['#FDE68A', '#F59E0B'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <ZenFace mood={mood} />,
    dialogues: {
        sad: ["The night is dry.", "Eclipsed by thirst.", "Need some lunar liquid."],
        mild: ["Waxing towards hydration!", "A sliver of hope.", "Reflecting the light."],
        okay: ["Half moon, half full!", "Glowing steady!", "Serene orbits."],
        happy: ["Full moon joy!", "Radiating lunar love!", "A perfect celestial cycle!"]
    }
};
