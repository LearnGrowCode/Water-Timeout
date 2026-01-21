import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { BottleMood } from '../lib/hydration-store';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WaterBottleProps {
    mood: BottleMood;
    fillLevel: number; // 0 to 1
    size?: number;
}

export function WaterBottle({ mood, fillLevel, size = 200 }: WaterBottleProps) {
    const clampedFill = Math.min(Math.max(fillLevel, 0), 1);

    // Animation values
    const fillAnim = useSharedValue(0);
    const waveOffset = useSharedValue(0);
    const floatAnim = useSharedValue(0);

    useEffect(() => {
        fillAnim.value = withSpring(clampedFill, { damping: 15 });
        waveOffset.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );
    }, [clampedFill, fillAnim, waveOffset, floatAnim]);

    const waterProps = useAnimatedProps(() => {
        const y = 180 - (fillAnim.value * 140);
        return {
            y: y,
            height: fillAnim.value * 140 + 20
        };
    });

    const getMoodColors = () => {
        switch (mood) {
            case 'happy': return [Colors.light.bottleFill.happyStart, Colors.light.bottleFill.happyEnd];
            case 'okay': return [Colors.light.bottleFill.okayStart, Colors.light.bottleFill.okayEnd];
            case 'mild': return [Colors.light.bottleFill.mildStart, Colors.light.bottleFill.mildEnd];
            case 'sad': return [Colors.light.bottleFill.sadStart, Colors.light.bottleFill.sadEnd];
        }
    };

    const [colorStart, colorEnd] = getMoodColors();

    const renderFace = () => {
        switch (mood) {
            case 'happy':
                return (
                    <G>
                        <Path d="M 55 85 Q 60 80 65 85" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                        <Path d="M 85 85 Q 90 80 95 85" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                        <Path d="M 55 105 Q 75 125 95 105" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                        <Circle cx="48" cy="100" r="6" fill="#11181C" opacity="0.1" />
                        <Circle cx="102" cy="100" r="6" fill="#11181C" opacity="0.1" />
                    </G>
                );
            case 'okay':
                return (
                    <G>
                        <Circle cx="60" cy="85" r="5" fill="#11181C" />
                        <Circle cx="90" cy="85" r="5" fill="#11181C" />
                        <Path d="M 60 105 Q 75 115 90 105" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                    </G>
                );
            case 'mild':
                return (
                    <G>
                        <Circle cx="60" cy="85" r="5" fill="#11181C" />
                        <Circle cx="90" cy="85" r="5" fill="#11181C" />
                        <Path d="M 60 108 L 90 108" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                    </G>
                );
            case 'sad':
                return (
                    <G>
                        <Circle cx="60" cy="88" r="5" fill="#11181C" />
                        <Circle cx="90" cy="88" r="5" fill="#11181C" />
                        <Path d="M 50 78 L 68 82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <Path d="M 100 78 L 82 82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <Path d="M 60 115 Q 75 100 90 115" fill="none" stroke="#11181C" strokeWidth="3" strokeLinecap="round" />
                    </G>
                );
        }
    };

    return (
        <Animated.View style={[styles.container, { width: size, height: size * 1.33 }, { transform: [{ translateY: floatAnim }] }]}>
            <Svg viewBox="0 0 150 200" width="100%" height="100%">
                <Defs>
                    <ClipPath id="bottleClip">
                        <Path d="M 35 50 L 35 160 Q 35 180 55 180 L 95 180 Q 115 180 115 160 L 115 50 Q 115 45 110 40 L 100 35 L 100 20 Q 100 15 95 15 L 55 15 Q 50 15 50 20 L 50 35 L 40 40 Q 35 45 35 50 Z" />
                    </ClipPath>
                    <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={colorEnd} />
                        <Stop offset="100%" stopColor={colorStart} />
                    </LinearGradient>
                    <LinearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#F8FAFC" />
                        <Stop offset="50%" stopColor="#FFFFFF" />
                        <Stop offset="100%" stopColor="#F8FAFC" />
                    </LinearGradient>
                </Defs>

                {/* Bottle outline */}
                <Path
                    d="M 35 50 L 35 160 Q 35 180 55 180 L 95 180 Q 115 180 115 160 L 115 50 Q 115 45 110 40 L 100 35 L 100 20 Q 100 15 95 15 L 55 15 Q 50 15 50 20 L 50 35 L 40 40 Q 35 45 35 50 Z"
                    fill="url(#bottleGradient)"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                />

                {/* Water fill */}
                <G clipPath="url(#bottleClip)">
                    <AnimatedRect
                        x="35"
                        width="80"
                        fill="url(#waterGradient)"
                        animatedProps={waterProps}
                    />

                    {/* Wave effect simplified for RN */}
                    <AnimatedCircle
                        cx="75"
                        cy={180 - (clampedFill * 140)}
                        r="120"
                        fill="url(#waterGradient)"
                        opacity={0.3}
                    />
                </G>

                {/* Bottle cap */}
                <Rect x="52" y="8" width="46" height="10" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

                {/* Shine effect */}
                <Path
                    d="M 45 55 L 45 150 Q 45 155 50 155 L 50 55 Q 50 50 45 55"
                    fill="white"
                    opacity="0.3"
                />

                {/* Face */}
                {renderFace()}
            </Svg>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
