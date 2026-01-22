import React from 'react';
import { StandardFace } from './faces';
import { MascotDefinition } from './types';

export const sport: MascotDefinition = {
    type: 'sport',
    name: 'Sport',
    path: "M 45 50 L 105 50 L 105 130 C 105 155 45 155 45 130 Z",
    hasCap: true,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Timeout! I need water.", "Man down! Hydrate me!", "Low energy..."],
        mild: ["Back in the game!", "Fueling up!", "Go go go!"],
        okay: ["Great form!", "Keep the momentum!", "Winning!"],
        happy: ["MVP status!", "Champion of hydration!", "Unstoppable!"]
    }
};
