import { getActiveMascots } from '@/components/mascots';
import { Dropdown } from '@/components/ui/Dropdown';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SettingRow } from '@/components/ui/SettingRow';
import { WaterBottle } from '@/components/WaterBottle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatValue, useHydration } from '@/lib/hydration-store';
import { styles } from '@/styles/pages/settings.style';
import { Bell, FlaskRound as Bottle, ClipboardList, Clock, Sparkles, Target, Volume2 } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { settings, updateSettings, loading } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    if (loading) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
                    <Text style={[styles.subtitle, { color: theme.icon }]}>Customize your hydration experience</Text>
                </View>

                {/* TRACKING SETTINGS */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.icon }]}>Tracking</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
                        <View style={styles.settingRowContainer}>
                            <SettingRow
                                icon={Sparkles}
                                title="Intake Unit"
                                subtitle="Tracking precision"
                                theme={theme}
                            >
                                <SegmentedControl
                                    options={['pts', 'ml', 'fl oz']}
                                    value={settings.intakeUnit === 'points' ? 'pts' : settings.intakeUnit === 'oz' ? 'fl oz' : 'ml'}
                                    onSelect={(val) => {
                                        const unitMap: Record<string, 'points' | 'ml' | 'oz'> = { 'pts': 'points', 'ml': 'ml', 'fl oz': 'oz' };
                                        updateSettings({ intakeUnit: unitMap[val] });
                                    }}
                                    theme={theme}
                                />
                            </SettingRow>
                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />
                            <SettingRow
                                icon={Target}
                                title="Daily Target"
                                subtitle="Daily hydration goal"
                                theme={theme}
                            >
                                <Dropdown
                                    label="Target"
                                    value={settings.dailyTarget}
                                    options={settings.intakeUnit === 'ml'
                                        ? [1000, 1500, 2000, 2500, 3000, 4000]
                                        : settings.intakeUnit === 'oz'
                                            ? [30, 40, 64, 80, 100, 128]
                                            : [8, 12, 16, 20, 24, 30]
                                    }
                                    renderOption={(val: number) => formatValue(val, settings.intakeUnit)}
                                    onSelect={(val: number) => updateSettings({ dailyTarget: val })}
                                    description="The average adult needs about 2.5L (85oz) of water daily for peak health."
                                    theme={theme}
                                />
                            </SettingRow>
                        </View>
                    </View>
                </Animated.View>

                {/* APPARANCE SETTINGS */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.icon }]}>Customization</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.card, padding: 16 }]}>
                        <View style={styles.settingHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.tint + '10' }]}>
                                <Bottle size={20} color={theme.tint} />
                            </View>
                            <View>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>Mascot Bottle</Text>
                                <Text style={[styles.settingSubtitle, { color: theme.icon, opacity: 0.6 }]}>Choose your companion</Text>
                            </View>
                        </View>

                        <View style={styles.bottleGrid}>
                            {getActiveMascots().map((mascot: any) => (
                                <TouchableOpacity
                                    key={mascot.type}
                                    style={[
                                        styles.bottleOption,
                                        { borderColor: 'transparent', backgroundColor: theme.secondaryBackground },
                                        settings.bottleType === mascot.type && { borderColor: theme.tint, backgroundColor: theme.tint + '10' }
                                    ]}
                                    onPress={() => updateSettings({ bottleType: mascot.type })}
                                >
                                    <View style={styles.bottlePreview}>
                                        <WaterBottle mood="happy" fillLevel={0.6} size={36} type={mascot.type} showDialogue={false} />
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

                {/* NOTIFICATIONS SETTINGS */}
                <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.icon }]}>Reminders</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
                        <View style={styles.settingRowContainer}>
                            <SettingRow
                                icon={Bell}
                                title="Frequency"
                                subtitle="How often to remind"
                                theme={theme}
                            >
                                <Dropdown
                                    label="Frequency"
                                    value={settings.reminderFrequency}
                                    options={[15, 30, 45, 60, 90, 120]}
                                    onSelect={(val: number) => updateSettings({ reminderFrequency: val })}
                                    suffix="min"
                                    theme={theme}
                                />
                            </SettingRow>
                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />
                            <SettingRow
                                icon={Clock}
                                title="Active Window"
                                subtitle="Start and end times"
                                theme={theme}
                            >
                                <View style={styles.timeInputs}>
                                    <Dropdown
                                        label="Start"
                                        value={settings.activeWindowStart}
                                        options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                        onSelect={(val: string) => updateSettings({ activeWindowStart: val })}
                                        theme={theme}
                                    />
                                    <Text style={{ color: theme.icon, marginHorizontal: 4, opacity: 0.5 }}>-</Text>
                                    <Dropdown
                                        label="End"
                                        value={settings.activeWindowEnd}
                                        options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                        onSelect={(val: string) => updateSettings({ activeWindowEnd: val })}
                                        theme={theme}
                                    />
                                </View>
                            </SettingRow>
                        </View>
                    </View>
                </Animated.View>

                {/* PREFERENCES SETTINGS */}
                <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.icon }]}>Preferences</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
                        <View style={styles.settingRowContainer}>
                            <SettingRow icon={Sparkles} title="Playful Tone" subtitle="Fun messages" theme={theme}>
                                <Switch
                                    value={settings.tone === 'playful'}
                                    onValueChange={(v) => updateSettings({ tone: v ? 'playful' : 'neutral' })}
                                    trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                                />
                            </SettingRow>
                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />
                            <SettingRow icon={Volume2} title="Sound Effects" theme={theme}>
                                <Switch
                                    value={settings.soundEnabled}
                                    onValueChange={(v) => updateSettings({ soundEnabled: v })}
                                    trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                                />
                            </SettingRow>
                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />
                            <SettingRow icon={ClipboardList} title="Daily Summary" theme={theme}>
                                <Switch
                                    value={settings.dailySummary}
                                    onValueChange={(v) => updateSettings({ dailySummary: v })}
                                    trackColor={{ false: colorScheme === 'dark' ? '#334155' : '#CBD5E1', true: theme.tint }}
                                />
                            </SettingRow>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}


