import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { MascotDefinition } from '../types';

const WhaleFace = ({ mood }: { mood: any }) => (
    <G transform="translate(0, 10)">
        {mood === 'happy' ? (
            <G>
                <Path d="M 50 85 Q 60 75 70 85" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 90 85 Q 100 75 110 85" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 65 110 Q 80 125 95 110" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </G>
        ) : (
            <G>
                <Circle cx="60" cy="85" r="4" fill="#1E293B" />
                <Circle cx="100" cy="85" r="4" fill="#1E293B" />
                <Path d="M 70 105 L 90 105" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </G>
        )}
    </G>
);

export const whale: MascotDefinition = {
    type: 'whale',
    name: 'Whale',
    path: "M 30 110 C 30 70 70 60 90 60 C 120 60 140 80 140 110 C 140 140 110 150 75 150 C 40 150 30 140 30 110 Z M 140 110 L 155 90 L 155 130 Z",
    colors: ['#1E3A8A', '#3B82F6'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <WhaleFace mood={mood} />,
    dialogues: {
        sad: ["Low tide... need water.", "Feeling beached.", "A big thirst for a big whale."],
        mild: ["Making ripples!", "Rising to the surface!", "Feeling the spray!"],
        okay: ["Swimming deep!", "A sea of hydration!", "Tail-flipping good!"],
        happy: ["Breaching with joy!", "The ocean is full and so am I!", "Whale-y great job!"]
    }
};
