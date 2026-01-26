import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SegmentedControlProps {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
    theme: any;
}

export const SegmentedControl = ({ options, value, onSelect, theme }: SegmentedControlProps) => {
    const selectedIndex = options.indexOf(value);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            left: withSpring(`${(selectedIndex / options.length) * 100}%`, {
                damping: 20,
                stiffness: 120,
            }),
            width: `${100 / options.length}%`,
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>
            <Animated.View style={[styles.indicator, animatedStyle, { backgroundColor: theme.card }]} />
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={styles.option}
                    onPress={() => onSelect(option)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.optionText,
                        { color: value === option ? theme.tint : theme.icon },
                        value === option && styles.activeText
                    ]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 36,
        borderRadius: 8,
        padding: 2,
        position: 'relative',
        width:300,
    },
    indicator: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginLeft:2,
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    optionText: {
        fontSize: 13,
        fontWeight: '500',
    },
    activeText: {
        fontWeight: '700',
    },
});
