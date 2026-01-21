import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DailySummary, getBottleMood, useHydration } from '@/lib/hydration-store';
import { Droplet } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackScreen() {
    const { settings, getDailySummaries, loading } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const summaries = getDailySummaries(14);

    if (loading) return null;

    const renderItem = ({ item, index }: { item: DailySummary; index: number }) => {
        const mood = getBottleMood(item.totalPoints, settings.dailyTarget);
        const date = new Date(item.date);
        const isToday = item.date === new Date().toISOString().split('T')[0];
        const isYesterday = item.date === new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let dateLabel = item.date;
        if (isToday) dateLabel = 'Today';
        else if (isYesterday) dateLabel = 'Yesterday';
        else {
            dateLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }

        const moodColor = theme.bottle[mood];

        return (
            <Animated.View
                entering={FadeInLeft.delay(index * 100)}
                style={[styles.card, { backgroundColor: 'white' }]}
            >
                <View style={[styles.iconContainer, { backgroundColor: moodColor + '20' }]}>
                    <Droplet size={20} color={moodColor} fill={item.totalPoints > 0 ? moodColor : 'transparent'} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.dateText, { color: theme.text }]}>{dateLabel}</Text>
                    <Text style={[styles.subText, { color: theme.icon }]}>{item.events.length} drinks logged</Text>
                </View>
                <View style={styles.pointsContainer}>
                    <Text style={[styles.pointsText, { color: theme.tint }]}>{item.totalPoints}</Text>
                    <Text style={[styles.pointsSub, { color: theme.icon }]}>points</Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Track History</Text>
                <Text style={[styles.subtitle, { color: theme.icon }]}>Last 14 days of hydration</Text>
            </View>
            <FlatList
                data={summaries}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subText: {
        fontSize: 14,
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 18,
        fontWeight: '700',
    },
    pointsSub: {
        fontSize: 12,
    },
});
