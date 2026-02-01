import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const turtle: MascotDefinition = {
    type: 'turtle',
    name: 'Sea Turtle',
    path: "M 45 100 Q 45 55 75 50 Q 105 55 105 100 Q 105 145 75 150 Q 45 145 45 100 Z M 105 85 Q 125 75 130 95 Q 125 105 110 95 Z M 45 85 Q 25 75 20 95 Q 25 105 40 95 Z M 105 115 Q 120 130 115 140 Q 105 135 100 120 Z M 45 115 Q 30 130 35 140 Q 45 135 50 120 Z M 75 50 Q 75 30 75 40",
    colors: ['#2DD4BF', '#0D9488'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Stuck on dry land...", "Shell feels heavy.", "Need the ocean."],
        mild: [" Paddling out.", "Cool water feels good.", "Moving steadily."],
        okay: ["Cruising the currents!", "Shell yeah!", "Smooth swimming."],
        happy: ["King of the ocean!", "Riding the waves!", "Totally tubular!"]
    }
};
