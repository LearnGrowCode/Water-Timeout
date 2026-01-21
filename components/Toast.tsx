import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    FadeOutUp
} from 'react-native-reanimated';


interface ToastProps {
    message: string;
    subMessage?: string;
    emoji?: string;
    onClose: () => void;
}

export function Toast({ message, subMessage, emoji, onClose }: ToastProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={[styles.container, { backgroundColor: 'white', shadowColor: theme.text }]}
        >
            <View style={[styles.emojiContainer, { backgroundColor: theme.tint + '10' }]}>
                <Text style={styles.emoji}>{emoji || '💧'}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
                {subMessage && <Text style={[styles.subMessage, { color: theme.icon }]}>{subMessage}</Text>}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        zIndex: 1000,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    emojiContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emoji: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    message: {
        fontSize: 14,
        fontWeight: '700',
    },
    subMessage: {
        fontSize: 12,
    },
});
