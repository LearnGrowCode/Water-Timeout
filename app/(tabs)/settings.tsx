import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHydration } from '@/lib/hydration-store';
import { Bell, ClipboardList, Clock, Sparkles, Target, Trash2, Volume2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { settings, updateSettings, clearHistory, loading } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    if (loading) return null;

    const handleClearHistory = () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all hydration data? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearHistory }
            ]
        );
    };

    const SettingRow = ({ icon: Icon, title, subtitle, children, style }: any) => (
        <View style={[styles.settingCard, { backgroundColor: 'white' }, style]}>
            <View style={styles.settingHeader}>
                <View style={[styles.iconContainer, { backgroundColor: theme.tint + '10' }]}>
                    <Icon size={20} color={theme.tint} />
                </View>
                <View style={styles.settingTitleContainer}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
                    {subtitle && <Text style={[styles.settingSubtitle, { color: theme.icon }]}>{subtitle}</Text>}
                </View>
                {children}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
                    <Text style={[styles.subtitle, { color: theme.icon }]}>Customize your reminders</Text>
                </View>

                <Animated.View entering={FadeInDown.delay(100)}>
                    <SettingRow
                        icon={Bell}
                        title="Reminder Frequency"
                        subtitle={`Every ${settings.reminderFrequency} minutes`}
                    >
                        {/* Simple buttons for frequency as a placeholder for slider */}
                        <View style={styles.freqButtons}>
                            {[30, 60, 90, 120].map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => updateSettings({ reminderFrequency: val })}
                                    style={[
                                        styles.freqButton,
                                        settings.reminderFrequency === val && { backgroundColor: theme.tint }
                                    ]}
                                >
                                    <Text style={[
                                        styles.freqButtonText,
                                        settings.reminderFrequency === val && { color: 'white' }
                                    ]}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(150)}>
                    <SettingRow
                        icon={Target}
                        title="Daily Points Target"
                        subtitle={`${settings.dailyTarget} points per day`}
                    >
                        <View style={styles.freqButtons}>
                            {[12, 16, 20, 24].map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => updateSettings({ dailyTarget: val })}
                                    style={[
                                        styles.freqButton,
                                        settings.dailyTarget === val && { backgroundColor: theme.tint }
                                    ]}
                                >
                                    <Text style={[
                                        styles.freqButtonText,
                                        settings.dailyTarget === val && { color: 'white' }
                                    ]}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <SettingRow
                        icon={Clock}
                        title="Active Window"
                        subtitle="Only remind between these times"
                    >
                        <View style={styles.timeInputs}>
                            <Text style={{ color: theme.tint, fontWeight: '600' }}>{settings.activeWindowStart} - {settings.activeWindowEnd}</Text>
                        </View>
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <SettingRow icon={Sparkles} title="Playful Tone" subtitle="Use fun, encouraging messages">
                        <Switch
                            value={settings.tone === 'playful'}
                            onValueChange={(v) => updateSettings({ tone: v ? 'playful' : 'neutral' })}
                            trackColor={{ false: '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400)}>
                    <SettingRow icon={Volume2} title="Sound Effects" subtitle="Play sounds for notifications">
                        <Switch
                            value={settings.soundEnabled}
                            onValueChange={(v) => updateSettings({ soundEnabled: v })}
                            trackColor={{ false: '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500)}>
                    <SettingRow icon={ClipboardList} title="Daily Summary" subtitle="Get a summary at end of day">
                        <Switch
                            value={settings.dailySummary}
                            onValueChange={(v) => updateSettings({ dailySummary: v })}
                            trackColor={{ false: '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600)}>
                    <TouchableOpacity onPress={handleClearHistory}>
                        <SettingRow icon={Trash2} title="Clear History" subtitle="Delete all hydration data" style={styles.dangerCard}>
                            <View />
                        </SettingRow>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
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
    settingCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitleContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    settingSubtitle: {
        fontSize: 13,
    },
    freqButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    freqButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    freqButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    timeInputs: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    dangerCard: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
});
