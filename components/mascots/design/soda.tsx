import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const soda: MascotDefinition = {
    type: 'soda',
    name: 'Soda',
    path: "M 50 40 C 50 30 100 30 100 40 L 110 150 Q 110 160 100 160 L 50 160 Q 40 160 40 150 Z",
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Lost my fizz...", "Feeling flat.", "Water is better than soda!"],
        mild: ["Bubbling up!", "Getting some spark back!", "Freshness incoming!"],
        okay: ["Feeling crisp!", "Great choice!", "Sparkling clean!"],
        happy: ["Maximum fizz!", "Pop-tastic hydration!", "Refreshment level 100!"]
    }
};
