import { getActiveMascots } from '@/components/mascots';
import { Dropdown } from '@/components/ui/Dropdown';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SettingRow } from '@/components/ui/SettingRow';
import { WaterBottle } from '@/components/WaterBottle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatValue, UNIT_EMOJIS, UNIT_LABELS, UnitType, useHydration } from '@/lib/hydration-store';
import { styles } from '@/styles/pages/settings.style';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Bell, FlaskRound as Bottle, ClipboardList, Clock, LayoutGrid, Sparkles, Target, Volume2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
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
                                alignment="col"
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
                                icon={Clock}
                                title="Active Window"
                                subtitle="Time window to get notification for water-timeout"
                                theme={theme}
                                alignment='col'
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

                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />

                            <SettingRow
                                icon={Bell}
                                title="Frequency"
                                subtitle="How often to remind"
                                theme={theme}
                            >
                                <Dropdown
                                    label="Frequency"
                                    value={settings.reminderFrequency}
                                    options={[10, 15, 30, 45, 60, 90, 120]}
                                    onSelect={(val: number) => updateSettings({ reminderFrequency: val })}
                                    suffix="min"
                                    theme={theme}
                                />
                            </SettingRow>

                            <View style={[styles.settingSeparator, { backgroundColor: theme.secondaryBackground }]} />

                            <SettingRow
                                icon={Volume2}
                                title="Reminder Sound"
                                subtitle="Pick your notification tone"
                                theme={theme}
                                alignment='col'
                            >
                                <View style={{ gap: 8, width: '100%', marginTop: 8 ,paddingBottom:20}}>
                                    <Dropdown
                                        label="Sound"
                                        value={settings.notificationSound}
                                        options={['sound1', 'sound2', 'sound3', ...(settings.notificationSound && settings.notificationSound.startsWith('file://') ? [settings.notificationSound] : [])]}
                                        renderOption={(val) => {
                                            if (val === 'sound1') return 'Droplet';
                                            if (val === 'sound2') return 'Splash';
                                            if (val === 'sound3') return 'Chime';
                                            return 'Custom Sound';
                                        }}
                                        onSelect={(val: string) => updateSettings({ notificationSound: val })}
                                        theme={theme}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            padding: 12,
                                            backgroundColor: theme.secondaryBackground,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: theme.tint + '20',
                                            marginTop: 4
                                        }}
                                        onPress={async () => {
                                            try {
                                                const result = await DocumentPicker.getDocumentAsync({
                                                    type: 'audio/*',
                                                    copyToCacheDirectory: true
                                                });

                                                if (!result.canceled && result.assets && result.assets.length > 0) {
                                                    const asset = result.assets[0];
                                                    const fileName = `custom_sound_${Date.now()}_${asset.name}`;
                                                    const newPath = `${FileSystem.documentDirectory}${fileName}`;

                                                    await FileSystem.copyAsync({
                                                        from: asset.uri,
                                                        to: newPath
                                                    });

                                                    updateSettings({ notificationSound: newPath });
                                                    Alert.alert("Success", "Custom sound added! Note: Custom sounds may only work on Android.");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                Alert.alert("Error", "Failed to pick sound file.");
                                            }
                                        }}
                                    >
                                        <Text style={{ color: theme.tint, fontWeight: '600' }}>+ Add Custom Sound</Text>
                                    </TouchableOpacity>
                                </View>
                            </SettingRow>
                        </View>
                    </View>
                </Animated.View>

                {/* NOTIFICATION ACTIONS SETTINGS */}
                <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.icon }]}>Quick Actions</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.card, padding: 16 }]}>
                        <View style={styles.settingHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.tint + '10' }]}>
                                <LayoutGrid size={20} color={theme.tint} />
                            </View>
                            <View>
                                <Text style={[styles.settingTitle, { color: theme.text }]}>Notification Buttons</Text>
                                <Text style={[styles.settingSubtitle, { color: theme.icon, opacity: 0.6 }]}>Select 3 options for quick logging</Text>
                            </View>
                        </View>

                        <View style={styles.bottleGrid}>
                            {(['sip', 'quarter', 'half', 'full'] as UnitType[]).map((unit) => {
                                const isSelected = settings.notificationActions.includes(unit);
                                return (
                                    <TouchableOpacity
                                        key={unit}
                                        style={[
                                            styles.bottleOption,
                                            { borderColor: 'transparent', backgroundColor: theme.secondaryBackground },
                                            isSelected && { borderColor: theme.tint, backgroundColor: theme.tint + '10' }
                                        ]}
                                        onPress={() => {
                                            let newActions = [...settings.notificationActions];
                                            if (isSelected) {
                                                if (newActions.length > 1) {
                                                    newActions = newActions.filter(a => a !== unit);
                                                }
                                            } else {
                                                newActions.push(unit);
                                                if (newActions.length > 3) {
                                                    newActions.shift(); // Remove the oldest selection to keep it at 3
                                                }
                                            }
                                            updateSettings({ notificationActions: newActions });
                                        }}
                                    >
                                        <Text style={{ fontSize: 24, marginBottom: 4 }}>{UNIT_EMOJIS[unit]}</Text>
                                        <Text style={[
                                            styles.bottleLabel,
                                            { color: theme.text },
                                            isSelected && { color: theme.tint, fontWeight: '700' }
                                        ]}>
                                            {UNIT_LABELS[unit]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Text style={[styles.settingSubtitle, { color: theme.icon, opacity: 0.6, marginTop: 8, textAlign: 'center' }]}>
                            Current: {settings.notificationActions.length}/3 selected
                        </Text>
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
        </SafeAreaView >
    );
}


