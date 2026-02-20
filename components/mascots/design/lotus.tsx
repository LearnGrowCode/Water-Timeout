import React from 'react';

import { MascotDefinition } from '../types';
import { ZenFace } from './faces';

export const lotus: MascotDefinition = {
    type: 'lotus',
    name: 'Lotus',
    path: "M 75 50 C 95 50 115 80 115 110 C 115 140 95 160 75 160 C 55 160 35 140 35 110 C 35 80 55 50 75 50 Z M 75 50 C 75 50 45 70 35 110 M 75 50 C 75 50 105 70 115 110",
    colors: ['#F472B6', '#EC4899'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <ZenFace mood={mood} />,
    dialogues: {
        sad: ["Waiting to bloom...", "The pond is low.", "Gently seeking water."],
        mild: ["Starting to open!", "Feeling the morning dew.", "Growing steady."],
        okay: ["In partial bloom!", "Fresh and vibrant!", "Serene Waters."],
        happy: ["Full blossom joy!", "The sun and water are perfect!", "Radiating beauty!"]
    }
};
