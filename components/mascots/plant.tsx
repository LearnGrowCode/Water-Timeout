import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const plant: MascotDefinition = {
    type: 'plant',
    name: 'Plant',
    path: "M 60 160 L 90 160 L 100 80 Q 75 60 50 80 Z M 75 80 L 75 40 M 75 60 L 100 40 M 75 60 L 50 40",
    colors: ['#059669', '#10B981'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Wilting... water please.", "Dry soil, dry leaves.", "A bit droopy today."],
        mild: ["Starting to perk up!", "Soaking it in!", "Green shoots of progress!"],
        okay: ["Basking in hydration!", "Growing strong!", "Healthy leaves!"],
        happy: ["In full bloom!", "Photosynthesizing joy!", "The garden is thriving!"]
    }
};
