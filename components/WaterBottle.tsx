import React, { useEffect, useMemo } from 'react';
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
import { BottleMood, BottleType } from '../lib/hydration-store';


const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WaterBottleProps {
    mood: BottleMood;
    fillLevel: number; // 0 to 1
    size?: number;
    type?: BottleType;
}

export function WaterBottle({ mood, fillLevel, size = 200, type = 'classic' }: WaterBottleProps) {

    const clampedFill = Math.min(Math.max(fillLevel, 0), 1);

    const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);

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

    const getBottleShape = () => {
        switch (type) {
            case 'slim':
                return "M 50 20 L 50 165 Q 50 180 65 180 L 85 180 Q 100 180 100 165 L 100 20 Q 100 15 95 15 L 55 15 Q 50 15 50 20 Z";
            case 'sport':
                return "M 45 40 L 45 160 Q 45 180 60 180 L 90 180 Q 105 180 105 160 L 105 40 L 95 35 L 95 20 Q 95 15 90 15 L 60 15 Q 55 15 55 20 L 55 35 L 45 40 Z M 45 80 L 105 80 M 45 120 L 105 120";
            case 'square':
                return "M 40 30 L 40 170 Q 40 180 50 180 L 100 180 Q 110 180 110 170 L 110 30 Q 110 20 100 20 L 50 20 Q 40 20 40 30 Z";
            case 'gallon':
                return "M 30 60 L 30 160 Q 30 180 50 180 L 100 180 Q 120 180 120 160 L 120 60 Q 120 50 110 45 L 90 40 L 90 20 Q 90 15 85 15 L 65 15 Q 60 15 60 20 L 60 40 L 40 45 Q 30 50 30 60 Z";
            case 'soda':
                return "M 45 180 Q 40 180 40 170 L 40 100 Q 40 60 75 40 L 75 20 Q 75 15 80 15 L 80 40 Q 115 60 115 100 L 115 170 Q 115 180 110 180 Z";
            case 'cup':
                return "M 45 40 L 55 170 Q 56 180 65 180 L 85 180 Q 94 180 95 170 L 105 40 Z M 105 60 Q 125 60 125 90 Q 125 120 105 120";
            case 'barrel':
                return "M 40 40 Q 30 100 40 160 Q 45 180 75 180 Q 105 180 110 160 Q 120 100 110 40 Q 105 20 75 20 Q 45 20 40 40 Z";
            case 'crystal':
                return "M 75 15 L 45 40 L 45 150 L 75 185 L 105 150 L 105 40 Z";
            case 'classic':
            default:
                return "M 35 50 L 35 160 Q 35 180 55 180 L 95 180 Q 115 180 115 160 L 115 50 Q 115 45 110 40 L 100 35 L 100 20 Q 100 15 95 15 L 55 15 Q 50 15 50 20 L 50 35 L 40 40 Q 35 45 35 50 Z";
        }
    };

    const bottlePath = getBottleShape();

    const renderFace = () => {
        const faceY = type === 'gallon' ? 20 : 0;
        return (
            <G transform={`translate(0, ${faceY})`}>
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
    };

    return (
        <Animated.View style={[styles.container, { width: size, height: size * 1.33 }, { transform: [{ translateY: floatAnim }] }]}>
            <Svg viewBox="0 0 150 200" width="100%" height="100%">
                <Defs>
                    <ClipPath id={`bottleClip-${id}`}>
                        <Path d={bottlePath} />
                    </ClipPath>
                    <LinearGradient id={`waterGradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={colorEnd} />
                        <Stop offset="100%" stopColor={colorStart} />
                    </LinearGradient>
                    <LinearGradient id={`bottleGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#F8FAFC" />
                        <Stop offset="50%" stopColor="#FFFFFF" />
                        <Stop offset="100%" stopColor="#F8FAFC" />
                    </LinearGradient>
                </Defs>

                {/* Bottle outline */}
                <Path
                    d={bottlePath}
                    fill={`url(#bottleGradient-${id})`}
                    stroke="#CBD5E1"
                    strokeWidth="3"
                />

                {/* Water fill */}
                <G clipPath={`url(#bottleClip-${id})`}>
                    <AnimatedRect
                        x="35"
                        width="80"
                        fill={`url(#waterGradient-${id})`}
                        animatedProps={waterProps}
                    />

                    {/* Wave effect simplified for RN */}
                    <AnimatedCircle
                        cx="75"
                        cy={180 - (clampedFill * 140)}
                        r="120"
                        fill={`url(#waterGradient-${id})`}
                        opacity={0.3}
                    />
                </G>

                {/* Bottle cap (only for some types) */}
                {(type === 'classic' || type === 'gallon' || type === 'sport' || type === 'soda') && (
                    <Rect x="52" y="8" width="46" height="10" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                )}

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
