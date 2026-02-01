import { G } from 'react-native-svg';
import { MascotDefinition } from '../types';
import { StandardFace } from './faces';

export const plant: MascotDefinition = {
    type: 'plant',
    name: 'Sprout',
    path: "M 55 130 L 95 130 L 105 160 L 45 160 Z M 75 130 L 75 80 Q 75 50 45 60 Q 75 80 75 100 Q 75 80 105 60 Q 75 50 75 80",
    colors: ['#4ADE80', '#15803D'],
    hasCap: false,
    show: true,
    renderFace: (mood) => (
        <G transform="translate(0, 45)">
            <StandardFace mood={mood} />
        </G>
    ),
    dialogues: {
        sad: ["I'm wilting...", "Roots need water.", "Thirsty little sprout."],
        mild: ["Growing slowly...", "One drop at a time.", "Roots are happy."],
        okay: ["New leaf growing!", "Feeling taller!", "Getting stronger!"],
        happy: ["Fully bloomed!", "Nature's best!", "Thriving and green!"]
    }
};
