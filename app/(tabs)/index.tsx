import { Toast } from '@/components/Toast';
import { WaterBottle } from '@/components/WaterBottle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getBottleMood, getMoodLabel, UNIT_EMOJIS, UNIT_LABELS, UNIT_VALUES, UnitType, useHydration } from '@/lib/hydration-store';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width } = Dimensions.get('window');

export default function TodayScreen() {
  const { settings, addEvent, getTodayPoints, events, loading } = useHydration();
  const [toast, setToast] = React.useState<{ message: string; subMessage?: string; emoji?: string } | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const todayPoints = getTodayPoints();
  const mood = getBottleMood(todayPoints, settings.dailyTarget);
  const fillLevel = Math.min(todayPoints / settings.dailyTarget, 1);
  const drinksToday = (events[new Date().toISOString().split('T')[0]] || []).length;

  const handleLog = async (unit: UnitType) => {
    await addEvent(unit);
    setToast({
      message: `${UNIT_LABELS[unit]} logged!`,
      subMessage: 'Hydration hero! 🚀',
      emoji: UNIT_EMOJIS[unit]
    });
  };

  if (loading) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          emoji={toast.emoji}
          onClose={() => setToast(null)}
        />
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Water Timeout</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>Stay hydrated, stay happy!</Text>
        </Animated.View>

        <Animated.View entering={ZoomIn.delay(400)} style={styles.moodContainer}>
          <View style={styles.moodBubble}>
            <Text style={styles.moodText}>{getMoodLabel(mood)}</Text>
          </View>
        </Animated.View>

        <WaterBottle mood={mood} fillLevel={fillLevel} size={width * 0.6} />

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.icon }]}>{drinksToday} drinks today</Text>
            <Text style={[styles.statValue, { color: theme.tint }]}>{Math.round(fillLevel * 100)}%</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: theme.tabIconDefault + '20' }]}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${fillLevel * 100}%`, backgroundColor: theme.tint }
              ]}
            />
          </View>
          <Text style={[styles.pointsLabel, { color: theme.icon }]}>{todayPoints} / {settings.dailyTarget} points</Text>
        </View>

        <View style={styles.logSection}>
          <Text style={[styles.logTitle, { color: theme.text }]}>Log your water intake</Text>
          <View style={styles.grid}>
            {(['sip', 'quarter', 'half', 'full'] as UnitType[]).map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[styles.intakeCard, { backgroundColor: theme.background, shadowColor: theme.text }]}
                onPress={() => handleLog(unit)}
              >
                <Text style={styles.intakeEmoji}>{UNIT_EMOJIS[unit]}</Text>
                <Text style={[styles.intakeLabel, { color: theme.text }]}>{UNIT_LABELS[unit]}</Text>
                <Text style={[styles.intakePoints, { color: theme.icon }]}>+{UNIT_VALUES[unit]} pts</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  moodContainer: {
    marginBottom: 20,
  },
  moodBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  statsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  pointsLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  logSection: {
    width: '100%',
    marginTop: 40,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  intakeCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  intakeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  intakeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  intakePoints: {
    fontSize: 12,
  },
});
