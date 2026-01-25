import React from 'react';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const square: MascotDefinition = {
    type: 'square',
    name: 'Square',
    path: "M 45 45 L 105 45 L 105 155 L 45 155 Z",
    hasCap: true,
    show: true,
    renderFace: (mood) => <StandardFace mood={mood} />,
    dialogues: {
        sad: ["Feeling edgy... need water.", "Blocky and dry.", "Fill my corners!"],
        mild: ["Getting solid!", "Building up!", "Square deal!"],
        okay: ["Looking sharp!", "Great structure!", "Balanced!"],
        happy: ["Perfectly cubic!", "Rock solid hydration!", "Hip to be square!"]
    }
};
