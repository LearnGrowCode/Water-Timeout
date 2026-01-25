import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { BottleMood } from '../../../lib/hydration-store';

export const StandardFace = ({ mood }: { mood: BottleMood }) => (
    <G>
        {mood === 'happy' && (
            <G>
                <Path d="M 55 85 Q 60 80 65 85" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                <Path d="M 85 85 Q 90 80 95 85" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                <Path d="M 55 105 Q 75 125 95 105" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                <Circle cx="48" cy="100" r="6" fill="#11181C" opacity="0.1" />
                <Circle cx="102" cy="100" r="6" fill="#11181C" opacity="0.1" />
            </G>
        )}
        {mood === 'okay' && (
            <G>
                <Circle cx="60" cy="85" r="5" fill="#11181C" />
                <Circle cx="90" cy="85" r="5" fill="#11181C" />
                <Path d="M 60 105 Q 75 115 90 105" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
            </G>
        )}
        {mood === 'mild' && (
            <G>
                <Circle cx="60" cy="85" r="5" fill="#11181C" />
                <Circle cx="90" cy="85" r="5" fill="#11181C" />
                <Path d="M 60 108 L 90 108" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
            </G>
        )}
        {mood === 'sad' && (
            <G>
                <Circle cx="60" cy="88" r="5" fill="#11181C" />
                <Circle cx="90" cy="88" r="5" fill="#11181C" />
                <Path d="M 50 78 L 68 82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 100 78 L 82 82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                <Path d="M 60 115 Q 75 100 90 115" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
            </G>
        )}
    </G>
);

export const ZenFace = ({ mood }: { mood: BottleMood }) => (
    <G transform="translate(0, 10)">
        {mood === 'happy' ? (
            <G>
                <Path d="M 55 85 Q 65 75 75 85" fill="none" stroke="#11181C" strokeWidth="2.5" strokeLinecap="round" />
                <Path d="M 85 85 Q 95 75 105 85" fill="none" stroke="#11181C" strokeWidth="2.5" strokeLinecap="round" />
                <Path d="M 70 105 Q 80 115 90 105" fill="none" stroke="#11181C" strokeWidth="2" strokeLinecap="round" />
            </G>
        ) : (
            <G>
                <Path d="M 55 85 Q 65 95 75 85" fill="none" stroke="#11181C" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <Path d="M 85 85 Q 95 95 105 85" fill="none" stroke="#11181C" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <Circle cx="80" cy="110" r="1.5" fill="#11181C" opacity="0.4" />
            </G>
        )}
    </G>
);
