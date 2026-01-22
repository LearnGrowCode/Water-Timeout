import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const droplet: MascotDefinition = {
    type: 'droplet',
    name: 'Droplet',
    path: "M 75 30 C 75 30 120 80 120 120 C 120 145 100 165 75 165 C 50 165 30 145 30 120 C 30 80 75 30 75 30 Z",
    colors: ['#0EA5E9', '#38BDF8'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["I'm drying up!", "Need my fellow drops!", "Feeling small and thirsty."],
        mild: ["Making a splash!", "Ripple effects!", "Getting bigger!"],
        okay: ["Pure and fresh!", "Cool as a cucumber!", "Keep on flowing!"],
        happy: ["A whole ocean of joy!", "Perfectly plump with water!", "Splashing around!"]
    }
};
