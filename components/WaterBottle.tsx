import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { BottleMood, BottleType } from '../lib/hydration-store';
import { getMascotByType } from './mascots';


const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WaterBottleProps {
    mood: BottleMood;
    fillLevel: number; // 0 to 1
    size?: number;
    type?: BottleType;
    showDialogue?: boolean;
}

export function WaterBottle({ mood, fillLevel, size = 200, type = 'classic', showDialogue = true }: WaterBottleProps) {

    const clampedFill = Math.min(Math.max(fillLevel, 0), 1);
    const mascot = useMemo(() => getMascotByType(type), [type]);

    const id = useMemo(() => {
        return `${type}-${Math.random().toString(36).substr(2, 9)}`;
    }, [type]);

    // Animation values
    const fillAnim = useSharedValue(0);
    const waveOffset = useSharedValue(0);
    const floatAnim = useSharedValue(0);
    const bubbleScale = useSharedValue(0);

    const [currentDialogue, setCurrentDialogue] = React.useState("");

    useEffect(() => {
        if (!showDialogue) {
            bubbleScale.value = 0;
            return;
        }

        const dialogues = mascot.dialogues[mood];
        if (dialogues && dialogues.length > 0) {
            let index = 0;
            setCurrentDialogue(dialogues[0]);
            bubbleScale.value = withSpring(1);

            const interval = setInterval(() => {
                bubbleScale.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        index = (index + 1) % dialogues.length;
                        runOnJS(setCurrentDialogue)(dialogues[index]);
                        bubbleScale.value = withTiming(1, { duration: 300 });
                    }
                });
            }, 6000);

            return () => clearInterval(interval);
        }
    }, [mood, mascot, bubbleScale, showDialogue]);

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

    const bubbleStyle = useAnimatedStyle(() => {
        return {
            opacity: bubbleScale.value,
            transform: [
                { scale: bubbleScale.value },
                { translateY: -10 * (1 - bubbleScale.value) }
            ]
        };
    });

    const waterProps = useAnimatedProps(() => {
        const y = 180 - (fillAnim.value * 140);
        return {
            y: y,
            height: fillAnim.value * 140 + 20
        };
    });

    const moodColors = useMemo(() => {
        if (mascot.colors) return mascot.colors;

        switch (mood) {
            case 'happy': return [Colors.light.bottleFill.happyStart, Colors.light.bottleFill.happyEnd];
            case 'okay': return [Colors.light.bottleFill.okayStart, Colors.light.bottleFill.okayEnd];
            case 'mild': return [Colors.light.bottleFill.mildStart, Colors.light.bottleFill.mildEnd];
            case 'sad': return [Colors.light.bottleFill.sadStart, Colors.light.bottleFill.sadEnd];
            default: return [Colors.light.bottleFill.happyStart, Colors.light.bottleFill.happyEnd];
        }
    }, [mood, mascot]);

    const [colorStart, colorEnd] = moodColors;

    return (
        <View style={[styles.container, { width: size, height: showDialogue ? size * 1.5 : size * 1.33 }]}>
            {/* Speech Bubble */}
            {showDialogue && (
                <Animated.View style={[styles.bubbleWrapper, bubbleStyle]}>
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText}>{currentDialogue}</Text>
                        <View style={styles.bubbleTail} />
                    </View>
                </Animated.View>
            )}

            <Animated.View style={[{ width: size, height: size * 1.33 }, { transform: [{ translateY: floatAnim }] }]}>
                <Svg key={type} viewBox="0 0 150 200" width="100%" height="100%">
                    <Defs>
                        <ClipPath id={`bottleClip-${id}`}>
                            <Path d={mascot.path} />
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
                        d={mascot.path}
                        fill={`url(#bottleGradient-${id})`}
                        stroke="#CBD5E1"
                        strokeWidth="3"
                    />

                    {/* Water fill */}
                    <G clipPath={`url(#bottleClip-${id})`}>
                        <AnimatedRect
                            x="0"
                            y="0"
                            width="150"
                            height="200"
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

                    {/* Bottle cap */}
                    {mascot.hasCap && (
                        <Rect x="52" y="8" width="46" height="10" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                    )}

                    {/* Shine effect */}
                    <Path
                        d="M 45 55 L 45 150 Q 45 155 50 155 L 50 55 Q 50 50 45 55"
                        fill="white"
                        opacity="0.3"
                    />

                    {/* Face */}
                    {mascot.renderFace(mood)}
                </Svg>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bubbleWrapper: {
        position: 'absolute',
        top: 0,
        zIndex: 10,
        alignItems: 'center',
    },
    bubble: {
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        maxWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    bubbleText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    bubbleTail: {
        position: 'absolute',
        bottom: -6,
        left: '50%',
        marginLeft: -6,
        width: 12,
        height: 12,
        backgroundColor: 'black',
        transform: [{ rotate: '45deg' }],
    }
});
