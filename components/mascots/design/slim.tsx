import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const slim: MascotDefinition = {
    type: 'slim',
    name: 'Slim',
    path: "M 55 40 L 95 40 L 95 150 Q 95 160 85 160 L 65 160 Q 55 160 55 150 Z",
    hasCap: true,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Too slim... need water!", "I'm shrinking!", "Water, please?"],
        mild: ["Waking up!", "Keep it coming!", "Fluid motion!"],
        okay: ["Feeling fit!", "Great pace!", "Stay hydrated!"],
        happy: ["Peak performance!", "Feeling light and hydrated!", "Awesome job!"]
    }
};
