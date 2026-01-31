import { Dropdown } from '@/components/ui/Dropdown';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHydration } from '@/lib/hydration-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowRight, Bell, Check, Droplets, LayoutDashboard, Settings } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Welcome to\nWater Timeout',
        description: 'Your personal hydration companion. Track your water intake and keep your virtual bottle full!',
        icon: <Droplets size={80} color="#3B82F6" />,
    },
    {
        id: '2',
        title: 'Track With Ease',
        description: 'Simply tap the cup icons to log your intake. Sips, quarters, halves, or full cups - we count it all.',
        icon: <LayoutDashboard size={80} color="#3B82F6" />,
    },
    {
        id: '3',
        title: 'Smart Reminders',
        description: 'Set your hydration hours and notification frequency in settings. Never miss a sip!',
        icon: <Bell size={80} color="#3B82F6" />,
    },
    {
        id: '4',
        title: 'Stay Healthy',
        description: 'Customize your daily goals and bottle type in settings. Lets get started on your hydration journey!',
        icon: <Settings size={80} color="#3B82F6" />,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { settings, updateSettings } = useHydration();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            await completeOnboarding();
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('water-timeout-onboarding-completed', 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Failed to save onboarding status:', error);
            // Fallback navigation even if save fails
            router.replace('/(tabs)');
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width }]}>
                        <Animated.View
                            entering={FadeInDown.delay(200)}
                            style={[styles.iconContainer, { backgroundColor: theme.card }]}
                        >
                            {item.icon}
                        </Animated.View>
                        <View style={styles.textContainer}>
                            <Animated.Text
                                entering={FadeInDown.delay(400)}
                                style={[styles.title, { color: theme.text }]}
                            >
                                {item.title}
                            </Animated.Text>
                            <Animated.Text
                                entering={FadeInDown.delay(600)}
                                style={[styles.description, { color: theme.icon }]}
                            >
                                {item.description}
                            </Animated.Text>

                            {item.id === '3' && (
                                <Animated.View entering={FadeInDown.delay(800)} style={{ width: '100%', paddingHorizontal: 32, gap: 16, marginTop: 24 }}>
                                    <SegmentedControl
                                        options={['12h', '24h']}
                                        value={settings.timeFormat || '12h'}
                                        onSelect={(val) => updateSettings({ timeFormat: val })}
                                        theme={theme}
                                    />
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        <View style={{ flex: 1 }}>
                                            <Dropdown
                                                label="Start"
                                                value={settings.activeWindowStart}
                                                options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                                renderOption={(val) => {
                                                    if (settings.timeFormat === '24h') return val;
                                                    const [hours, minutes] = val.split(':');
                                                    const h = parseInt(hours, 10);
                                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                                    const h12 = h % 12 || 12;
                                                    return `${h12}:${minutes} ${ampm}`;
                                                }}
                                                onSelect={(val: string) => updateSettings({ activeWindowStart: val })}
                                                theme={theme}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Dropdown
                                                label="End"
                                                value={settings.activeWindowEnd}
                                                options={Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)}
                                                renderOption={(val) => {
                                                    if (settings.timeFormat === '24h') return val;
                                                    const [hours, minutes] = val.split(':');
                                                    const h = parseInt(hours, 10);
                                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                                    const h12 = h % 12 || 12;
                                                    return `${h12}:${minutes} ${ampm}`;
                                                }}
                                                onSelect={(val: string) => updateSettings({ activeWindowEnd: val })}
                                                theme={theme}
                                            />
                                        </View>
                                    </View>
                                    <Dropdown
                                        label="Frequency"
                                        value={settings.reminderFrequency}
                                        options={[10, 15, 30, 45, 60, 90, 120]}
                                        onSelect={(val: number) => updateSettings({ reminderFrequency: val })}
                                        suffix="min"
                                        theme={theme}
                                    />
                                </Animated.View>
                            )}
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? theme.tint : theme.tabIconDefault,
                                    width: index === currentIndex ? 24 : 8,
                                }
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.tint }]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Animated.View layout={FadeInRight} style={styles.buttonContent}>
                        <Text style={styles.buttonText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        {currentIndex === SLIDES.length - 1 ? (
                            <Check size={20} color="#fff" />
                        ) : (
                            <ArrowRight size={20} color="#fff" />
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 40,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 24,
    },
    footer: {
        padding: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        elevation: 2,
        minWidth: 140,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
