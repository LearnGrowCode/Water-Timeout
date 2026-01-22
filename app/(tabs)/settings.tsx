import { WaterBottle } from '@/components/WaterBottle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottleType, useHydration } from '@/lib/hydration-store';
import { Bell, FlaskRound as Bottle, ChevronDown, ClipboardList, Clock, Sparkles, Target, Trash2, Volume2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

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

    const Dropdown = ({ label, value, options, onSelect, icon: Icon }: any) => {
        const [modalVisible, setModalVisible] = useState(false);

        return (
            <>
                <TouchableOpacity
                    style={[styles.dropdownTrigger, { backgroundColor: '#F1F5F9' }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={[styles.dropdownTriggerText, { color: theme.text }]}>{value}</Text>
                    <ChevronDown size={16} color={theme.icon} />
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    >
                        <Animated.View
                            entering={FadeInDown.duration(200)}
                            style={[styles.modalContent, { backgroundColor: 'white' }]}
                        >
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Select {label}</Text>
                            {options.map((option: any) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionItem,
                                        value === option && { backgroundColor: theme.tint + '10' }
                                    ]}
                                    onPress={() => {
                                        onSelect(option);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: theme.text },
                                        value === option && { color: theme.tint, fontWeight: '700' }
                                    ]}>
                                        {option} {label === "Frequency" ? "minutes" : "points"}
                                    </Text>
                                    {value === option && <View style={[styles.activeDot, { backgroundColor: theme.tint }]} />}
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    </TouchableOpacity>
                </Modal>
            </>
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
                        <Dropdown
                            label="Frequency"
                            value={settings.reminderFrequency}
                            options={[15, 30, 45, 60, 90, 120]}
                            onSelect={(val: number) => updateSettings({ reminderFrequency: val })}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(150)}>
                    <SettingRow
                        icon={Target}
                        title="Daily Points Target"
                        subtitle={`${settings.dailyTarget} points per day`}
                    >
                        <Dropdown
                            label="Target"
                            value={settings.dailyTarget}
                            options={[8, 12, 16, 20, 24, 30]}
                            onSelect={(val: number) => updateSettings({ dailyTarget: val })}
                        />
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

                <Animated.View entering={FadeInDown.delay(250)}>
                    <View style={[styles.settingCard, { backgroundColor: 'white' }]}>
                        <View style={styles.settingHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.tint + '10' }]}>
                                <Bottle size={20} color={theme.tint} />
                            </View>
                            <View style={styles.settingTitleContainer}>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>Mascot Bottle</Text>
                                <Text style={[styles.settingSubtitle, { color: theme.icon }]}>Choose your favorite mascot</Text>
                            </View>
                        </View>

                        <View style={styles.bottleGrid}>
                            {(['classic', 'slim', 'sport', 'square', 'gallon', 'soda', 'cup', 'barrel', 'crystal'] as BottleType[]).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.bottleOption,
                                        settings.bottleType === type && { borderColor: theme.tint, backgroundColor: theme.tint + '05' }
                                    ]}
                                    onPress={() => updateSettings({ bottleType: type })}
                                >
                                    <View style={styles.bottlePreview}>
                                        <WaterBottle mood="happy" fillLevel={0.6} size={40} type={type} />
                                    </View>
                                    <Text style={[
                                        styles.bottleLabel,
                                        { color: theme.text },
                                        settings.bottleType === type && { color: theme.tint, fontWeight: '700' }
                                    ]}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
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
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 8,
        minWidth: 80,
        justifyContent: 'space-between',
    },
    dropdownTriggerText: {
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    bottleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
        justifyContent: 'space-between',
    },
    bottleOption: {
        width: '30%',
        padding: 12,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F1F5F9',
        alignItems: 'center',
        gap: 8,
    },
    bottlePreview: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottleLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});

