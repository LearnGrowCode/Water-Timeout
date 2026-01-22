import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const barrel: MascotDefinition = {
    type: 'barrel',
    name: 'Barrel',
    path: "M 45 40 C 35 70 35 130 45 160 L 105 160 C 115 130 115 70 105 40 Z",
    hasCap: true,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Dry as an old barrel.", "I'm hollow...", "Need a refill!"],
        mild: ["Rolling along!", "Starting to fill!", "Getting heavy!"],
        okay: ["A barrel of fun!", "Great job!", "Solid hydration!"],
        happy: ["Overflowing!", "Peak capacity!", "Rolling in hydration!"]
    }
};
