import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const crystal: MascotDefinition = {
    type: 'crystal',
    name: 'Crystal',
    path: "M 75 30 L 110 50 L 110 140 L 75 160 L 40 140 L 40 50 Z",
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["My light is fading... need water.", "Cracked and thirsty.", "I need to recharge."],
        mild: ["Starting to glimmer!", "Catching the light!", "Energy rising!"],
        okay: ["Shining bright!", "Pure hydration!", "Clear as day!"],
        happy: ["Radiant energy!", "I'm glowing with hydration!", "Crystal clear progress!"]
    }
};
