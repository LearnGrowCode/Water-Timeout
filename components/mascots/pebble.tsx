import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const pebble: MascotDefinition = {
    type: 'pebble',
    name: 'Pebble',
    path: "M 50 70 Q 75 50 100 70 Q 115 100 100 140 Q 75 160 50 140 Q 35 100 50 70 Z",
    colors: ['#6B7280', '#9CA3AF'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["A bit dusty here.", "Need a wash... and a drink.", "Feeling heavy and dry."],
        mild: ["Getting polished!", "Smooth as a river stone.", "Waking up!"],
        okay: ["Feeling solid!", "Strong as a rock!", "Great progress!"],
        happy: ["Shiny and smooth!", "I'm a happy little rock!", "Rolling in hydration!"]
    }
};
