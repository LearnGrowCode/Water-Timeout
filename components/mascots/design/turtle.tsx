import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const turtle: MascotDefinition = {
    type: 'turtle',
    name: 'Turtle',
    path: "M 40 100 Q 40 60 75 60 Q 110 60 110 100 Q 110 140 75 140 Q 40 140 40 100 Z M 110 100 L 125 100 M 40 100 L 25 100 M 75 60 L 75 45 M 75 140 L 75 155",
    colors: ['#166534', '#22C55E'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Slow... so slow... need water.", "The pond is far away.", "Feeling sluggish."],
        mild: ["Picking up the pace!", "Hydration helps me move!", "Slow and steady."],
        okay: ["Feeling shell-tastic!", "Great speed today!", "Swimming along!"],
        happy: ["Winning the race!", "Happy as a turtle in water!", "Totally Turtle-awesome!"]
    }
};
