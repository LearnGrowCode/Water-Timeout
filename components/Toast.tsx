import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from '@/styles/components/Toast.style';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
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
            style={[styles.container, { backgroundColor: theme.card, shadowColor: theme.text }]}
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

