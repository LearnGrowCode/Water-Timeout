import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { MascotDefinition } from '../types';

const CloudFace = ({ mood }: { mood: any }) => (
    <G transform="translate(0, 10)">
        {mood === 'happy' ? (
            <G>
                <Path d="M 55 85 Q 65 75 75 85" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 85 85 Q 95 75 105 85" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                <Circle cx="80" cy="100" r="4" fill="#64748B" opacity="0.5" />
            </G>
        ) : (
            <G>
                <Circle cx="60" cy="85" r="4" fill="#64748B" />
                <Circle cx="90" cy="85" r="4" fill="#64748B" />
                <Path d="M 68 105 L 82 105" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            </G>
        )}
    </G>
);

export const cloud: MascotDefinition = {
    type: 'cloud',
    name: 'Cloud',
    path: "M115,130 C135,130 140,110 120,105 C125,85 110,65 90,75 C80,60 60,60 50,75 C30,75 25,100 40,110 C25,120 30,130 50,130 Z",
    colors: ['#94A3B8', '#CBD5E1'],
    hasCap: false,
    show: true,
    renderFace: (mood) => <CloudFace mood={mood} />,
    dialogues: {
        sad: ["I'm feeling light... too light.", "Getting wispy...", "Need some rain!"],
        mild: ["Getting fluffy!", "Forming nicely!", "Drifting along."],
        okay: ["Cloud nine!", "Feeling soft and hydrated!", "Silver linings!"],
        happy: ["The silver lining is water!", "Fully saturated joy!", "Ready for a happy rain!"]
    }
};
