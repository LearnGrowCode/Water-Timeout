import { Toast } from "@/components/Toast";
import { WaterBottle } from "@/components/WaterBottle";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  formatValue,
  getBottleMood,
  getDateKey,
  getMoodLabel,
  getUnitValue,
  UNIT_EMOJIS,
  UNIT_LABELS,
  UnitType,
  useHydration,
} from "@/lib/hydration-store";
import { styles } from "@/styles/pages/index.style";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function TodayScreen() {
  const { settings, addEvent, getTodayPoints, events, loading } =
    useHydration();
  const [toast, setToast] = React.useState<{
    message: string;
    subMessage?: string;
    emoji?: string;
  } | null>(null);

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  const todayPoints = getTodayPoints();
  const mood = getBottleMood(todayPoints, settings.dailyTarget);
  const fillLevel = Math.min(todayPoints / settings.dailyTarget, 1);
  const drinksToday = (events[getDateKey()]?.events || []).length;

  const handleLog = async (unit: UnitType) => {
    await addEvent(unit);
    const value = getUnitValue(unit, settings);
    const displayValue = formatValue(value, settings.intakeUnit);
    setToast({
      message: `${displayValue} logged!`,
      subMessage: "Hydration hero! 🚀",
      emoji: UNIT_EMOJIS[unit],
    });
  };

  if (loading) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          <Text style={[styles.title, { color: theme.text }]}>
            Water Timeout
          </Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            Stay hydrated, stay happy!
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(400)}
          style={styles.moodContainer}
        >
          <View style={[styles.moodBubble, { backgroundColor: theme.card }]}>
            <Text style={styles.moodText}>{getMoodLabel(mood)}</Text>
          </View>
        </Animated.View>

        <WaterBottle
          mood={mood}
          fillLevel={fillLevel}
          size={width * 0.6}
          type={settings.bottleType}
        />

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.icon }]}>
              {drinksToday} drinks today
            </Text>
            <Text style={[styles.statValue, { color: theme.tint }]}>
              {Math.round(fillLevel * 100)}%
            </Text>
          </View>
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: theme.tabIconDefault + "20" },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${fillLevel * 100}%`, backgroundColor: theme.tint },
              ]}
            />
          </View>
          <Text style={[styles.pointsLabel, { color: theme.icon }]}>
            {formatValue(todayPoints, settings.intakeUnit)} /{" "}
            {formatValue(settings.dailyTarget, settings.intakeUnit)}
          </Text>
        </View>

        <View style={styles.logSection}>
          <View style={styles.grid}>
            {(["sip", "quarter", "half", "full"] as UnitType[]).map(
              (unit, index) => (
                <Animated.View
                  key={unit}
                  entering={FadeInUp.delay(600 + index * 100)}
                  style={styles.gridItem}
                >
                  <TouchableOpacity
                    style={[
                      styles.intakeCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.tint + "15",
                      },
                    ]}
                    onPress={() => handleLog(unit)}
                  >
                    <View
                      style={[
                        styles.emojiCircle,
                        { backgroundColor: theme.tint + "10" },
                      ]}
                    >
                      <Text style={styles.intakeEmoji}>
                        {UNIT_EMOJIS[unit]}
                      </Text>
                    </View>
                    <View style={styles.intakeInfo}>
                      <Text
                        style={[styles.intakeLabel, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {UNIT_LABELS[unit]}
                      </Text>
                      <View
                        style={[
                          styles.pointsBadge,
                          { backgroundColor: theme.tint },
                        ]}
                      >
                        <Text
                          style={[
                            styles.intakePoints,
                            { color: colorScheme === "dark" ? "#000" : "#fff" },
                          ]}
                        >
                          +
                          {formatValue(
                            getUnitValue(unit, settings),
                            settings.intakeUnit,
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ),
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
