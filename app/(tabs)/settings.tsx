import { getActiveMascots } from '@/components/mascots';
import { Dropdown } from '@/components/ui/Dropdown';
import { SettingRow } from '@/components/ui/SettingRow';
import { WaterBottle } from '@/components/WaterBottle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHydration } from '@/lib/hydration-store';
import { Bell, FlaskRound as Bottle, ClipboardList, Clock, Sparkles, Target, Volume2 } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './_settings.style';

export default function SettingsScreen() {
    const { settings, updateSettings, loading } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    if (loading) return null;

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
                        theme={theme}
                    >
                        <Dropdown
                            label="Frequency"
                            value={settings.reminderFrequency}
                            options={[15, 30, 45, 60, 90, 120]}
                            onSelect={(val: number) => updateSettings({ reminderFrequency: val })}
                            suffix="minutes"
                            theme={theme}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(150)}>
                    <SettingRow
                        icon={Target}
                        title="Daily Points Target"
                        subtitle={`${settings.dailyTarget} points per day`}
                        theme={theme}
                    >
                        <Dropdown
                            label="Target"
                            value={settings.dailyTarget}
                            options={[8, 12, 16, 20, 24, 30]}
                            onSelect={(val: number) => updateSettings({ dailyTarget: val })}
                            suffix="points"
                            theme={theme}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                    <SettingRow
                        icon={Clock}
                        title="Active Window"
                        subtitle="Only remind between these times"
                        theme={theme}
                    >
                        <View style={styles.timeInputs}>
                            <Dropdown
                                label="Start Time"
                                value={settings.activeWindowStart}
                                options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                onSelect={(val: string) => updateSettings({ activeWindowStart: val })}
                                theme={theme}
                            />
                            <Text style={{ color: theme.icon, marginHorizontal: 8 }}>to</Text>
                            <Dropdown
                                label="End Time"
                                value={settings.activeWindowEnd}
                                options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                onSelect={(val: string) => updateSettings({ activeWindowEnd: val })}
                                theme={theme}
                            />
                        </View>
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(250)}>
                    <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
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
                            {getActiveMascots().map((mascot) => (
                                <TouchableOpacity
                                    key={mascot.type}
                                    style={[
                                        styles.bottleOption,
                                        { borderColor: theme.secondaryBackground },
                                        settings.bottleType === mascot.type && { borderColor: theme.tint, backgroundColor: theme.tint + '05' }
                                    ]}
                                    onPress={() => updateSettings({ bottleType: mascot.type })}
                                >
                                    <View style={styles.bottlePreview}>
                                        <WaterBottle mood="happy" fillLevel={0.6} size={40} type={mascot.type} showDialogue={false} />
                                    </View>
                                    <Text style={[
                                        styles.bottleLabel,
                                        { color: theme.text },
                                        settings.bottleType === mascot.type && { color: theme.tint, fontWeight: '700' }
                                    ]}>
                                        {mascot.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300)}>
                    <SettingRow icon={Sparkles} title="Playful Tone" subtitle="Use fun, encouraging messages" theme={theme}>
                        <Switch
                            value={settings.tone === 'playful'}
                            onValueChange={(v) => updateSettings({ tone: v ? 'playful' : 'neutral' })}
                            trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400)}>
                    <SettingRow icon={Volume2} title="Sound Effects" subtitle="Play sounds for notifications" theme={theme}>
                        <Switch
                            value={settings.soundEnabled}
                            onValueChange={(v) => updateSettings({ soundEnabled: v })}
                            trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500)}>
                    <SettingRow icon={ClipboardList} title="Daily Summary" subtitle="Get a summary at end of day" theme={theme}>
                        <Switch
                            value={settings.dailySummary}
                            onValueChange={(v) => updateSettings({ dailySummary: v })}
                            trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                        />
                    </SettingRow>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}


