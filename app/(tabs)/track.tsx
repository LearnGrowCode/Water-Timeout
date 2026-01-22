import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DailySummary, getBottleMood, UNIT_EMOJIS, UNIT_LABELS, useHydration } from '@/lib/hydration-store';
import { ChevronDown, ChevronUp, Droplet, RotateCcw } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackScreen() {
    const { settings, getDailySummaries, resetToday, loading } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

    const summaries = getDailySummaries(14);

    if (loading) return null;

    const toggleExpand = (date: string) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleResetToday = () => {
        Alert.alert(
            "Reset Today",
            "Clear all of today's logs? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: resetToday }
            ]
        );
    };

    const renderItem = ({ item, index }: { item: DailySummary; index: number }) => {
        const mood = getBottleMood(item.totalPoints, settings.dailyTarget);
        const date = new Date(item.date);
        const todayDateKey = new Date().toISOString().split('T')[0];
        const isToday = item.date === todayDateKey;
        const isYesterday = item.date === new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isExpanded = !!expandedDates[item.date];

        let dateLabel = item.date;
        if (isToday) dateLabel = 'Today';
        else if (isYesterday) dateLabel = 'Yesterday';
        else {
            dateLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }

        const moodColor = theme.bottle[mood];

        return (
            <Animated.View
                layout={Layout.springify()}
                entering={FadeInLeft.delay(index * 50)}
                style={[styles.card, { backgroundColor: 'white' }]}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleExpand(item.date)}
                    style={styles.cardHeader}
                >
                    <View style={[styles.iconContainer, { backgroundColor: moodColor + '20' }]}>
                        <Droplet size={20} color={moodColor} fill={item.totalPoints > 0 ? moodColor : 'transparent'} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.dateRow}>
                            <Text style={[styles.dateText, { color: theme.text }]}>{dateLabel}</Text>
                            {isToday && item.events.length > 0 && (
                                <TouchableOpacity onPress={handleResetToday} style={styles.resetButton}>
                                    <RotateCcw size={14} color={theme.icon} />
                                    <Text style={[styles.resetText, { color: theme.icon }]}>Reset</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={[styles.subText, { color: theme.icon }]}>{item.events.length} drinks logged</Text>
                    </View>
                    <View style={styles.pointsContainer}>
                        <Text style={[styles.pointsText, { color: theme.tint }]}>{item.totalPoints}</Text>
                        <View style={styles.chevronRow}>
                            <Text style={[styles.pointsSub, { color: theme.icon }]}>pts</Text>
                            {item.events.length > 0 && (
                                isExpanded ? <ChevronUp size={16} color={theme.icon} /> : <ChevronDown size={16} color={theme.icon} />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {isExpanded && item.events.length > 0 && (
                    <Animated.View entering={FadeIn} style={styles.expandedContent}>
                        <View style={[styles.divider, { backgroundColor: theme.tint + '10' }]} />
                        {item.events.map((event) => (
                            <View key={event.id} style={styles.logItem}>
                                <View style={styles.logLeft}>
                                    <Text style={styles.logEmoji}>{UNIT_EMOJIS[event.unitType]}</Text>
                                    <Text style={[styles.logLabel, { color: theme.text }]}>{UNIT_LABELS[event.unitType]}</Text>
                                </View>
                                <Text style={[styles.logTime, { color: theme.icon }]}>
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        ))}
                    </Animated.View>
                )}
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
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    dateText: {
        fontSize: 17,
        fontWeight: '700',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    resetText: {
        fontSize: 11,
        fontWeight: '700',
    },
    subText: {
        fontSize: 13,
        fontWeight: '500',
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 20,
        fontWeight: '800',
    },
    pointsSub: {
        fontSize: 11,
        fontWeight: '600',
        marginRight: 4,
    },
    chevronRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandedContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 12,
        borderRadius: 1,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    logLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logEmoji: {
        fontSize: 18,
    },
    logLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    logTime: {
        fontSize: 12,
        fontWeight: '500',
    },
});
