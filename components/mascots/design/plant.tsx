import { G } from 'react-native-svg';

import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const plant: MascotDefinition = {
    type: 'plant',
    name: 'Sprout',
    // A high-fidelity "Kawaii" style sprout with a larger, rounder pot and expressive leaves
    path: `
        M 35 125 L 115 125 L 115 135 Q 75 145 35 135 Z
        M 40 135 L 110 135 L 100 175 Q 75 185 50 175 Z
        M 75 125 Q 50 80 20 95 Q 5 50 65 50 Q 75 85 75 125
        M 75 125 Q 100 80 130 95 Q 145 50 85 50 Q 75 85 75 125
    `.replace(/\s+/g, ' ').trim(),
    colors: ['#4ADE80', '#15803D'],
    hasCap: false,
    show: true,
    renderFace: (mood) => (
        <G transform="translate(0, 65)">
            <StandardFace mood={mood} />
        </G>
    ),
    dialogues: {
        sad: ["I'm wilting...", "Need some sunshine...", "Thirsty little sprout."],
        mild: ["Growing steady!", "One drop at a time.", "Roots are cozy."],
        okay: ["New leaf popping!", "Feeling taller!", "So fresh!"],
        happy: ["Full bloom baby!", "Photosynthesis power!", "Thriving and green!"]
    }
};
