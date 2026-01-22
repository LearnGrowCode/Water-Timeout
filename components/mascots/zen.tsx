import React from 'react';
import { ZenFace } from './faces';
import { MascotDefinition } from './types';

export const zen: MascotDefinition = {
    type: 'zen',
    name: 'Zen',
    path: "M 50 60 C 50 40 100 40 100 60 L 110 140 C 110 165 40 165 40 140 Z",
    colors: ['#10B981', '#34D399'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <ZenFace mood={mood} />,
    dialogues: {
        sad: ["The stream is dry...", "Seeking inner hydration.", "Patience... and water."],
        mild: ["Finding balance.", "A calm flow begins.", "Water is life."],
        okay: ["Harmonious hydration!", "Mindful drinking.", "Inner peace found."],
        happy: ["Enlightened hydration!", "The garden is blooming!", "Utter tranquility!"]
    }
};
