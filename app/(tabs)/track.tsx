import { ContributionGraph } from "@/components/ContributionGraph";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    DailySummary,
    formatValue,
    getBottleMood,
    getDateKey,
    getUnitValue,
    UNIT_EMOJIS,
    UNIT_LABELS,
    useHydration,
} from "@/lib/hydration-store";
import { styles } from "@/styles/pages/track.style";
import {
    ChevronDown,
    ChevronUp,
    Droplet,
    RotateCcw,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInLeft, Layout } from "react-native-reanimated";

export default function TrackScreen() {
  const { settings, getDailySummaries, resetToday, events, loading } =
    useHydration();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {},
  );

  const summaries = getDailySummaries(14);

  // Generate graph data: Show the entire current year from January 1st
  const currentYear = new Date().getFullYear();
  const firstDate = new Date(currentYear, 0, 1); // January 1st

  // Calculate total days in the current year
  const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeapYear(currentYear) ? 366 : 365;

  const graphSummaries: DailySummary[] = [];
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(firstDate);
    date.setDate(date.getDate() + i);
    const dateKey = getDateKey(date);
    const dayData = events[dateKey] || {
      events: [],
      target: settings.dailyTarget,
    };

    graphSummaries.push({
      date: dateKey,
      events: dayData.events,
      totalPoints: dayData.events.reduce(
        (sum, e) => sum + getUnitValue(e.unitType, settings),
        0,
      ),
      target: dayData.target,
    });
  }

  if (loading) return null;

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleResetToday = () => {
    Alert.alert(
      "Reset Today",
      "Clear all of today's logs? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetToday },
      ],
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: DailySummary;
    index: number;
  }) => {
    const mood = getBottleMood(item.totalPoints, item.target);
    const date = new Date(item.date);
    const todayDateKey = getDateKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateKey = getDateKey(yesterday);

    const isToday = item.date === todayDateKey;
    const isYesterday = item.date === yesterdayDateKey;
    const isExpanded = !!expandedDates[item.date];

    let dateLabel = item.date;
    if (isToday) dateLabel = "Today";
    else if (isYesterday) dateLabel = "Yesterday";
    else {
      dateLabel = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }

    const moodColor = theme.bottle[mood];

    return (
      <Animated.View
        layout={Layout.springify()}
        entering={FadeInLeft.delay(index * 50)}
        style={[styles.card, { backgroundColor: theme.card }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleExpand(item.date)}
          style={styles.cardHeader}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: moodColor + "20" },
            ]}
          >
            <Droplet
              size={20}
              color={moodColor}
              fill={item.totalPoints > 0 ? moodColor : "transparent"}
            />
          </View>
          <View style={styles.content}>
            <View style={styles.dateRow}>
              <Text style={[styles.dateText, { color: theme.text }]}>
                {dateLabel}
              </Text>
              {isToday && item.events.length > 0 && (
                <TouchableOpacity
                  onPress={handleResetToday}
                  style={[
                    styles.resetButton,
                    { backgroundColor: theme.secondaryBackground },
                  ]}
                >
                  <RotateCcw size={14} color={theme.icon} />
                  <Text style={[styles.resetText, { color: theme.icon }]}>
                    Reset
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.subText, { color: theme.icon }]}>
              {item.events.length} drinks logged
            </Text>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={[styles.pointsText, { color: theme.tint }]}>
              {formatValue(item.totalPoints, settings.intakeUnit)}
            </Text>
            <View style={styles.chevronRow}>
              {item.events.length > 0 &&
                (isExpanded ? (
                  <ChevronUp size={16} color={theme.icon} />
                ) : (
                  <ChevronDown size={16} color={theme.icon} />
                ))}
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && item.events.length > 0 && (
          <Animated.View entering={FadeIn} style={styles.expandedContent}>
            <View
              style={[styles.divider, { backgroundColor: theme.tint + "10" }]}
            />
            {item.events.map((event) => (
              <View key={event.id} style={styles.logItem}>
                <View style={styles.logLeft}>
                  <Text style={styles.logEmoji}>
                    {UNIT_EMOJIS[event.unitType]}
                  </Text>
                  <Text style={[styles.logLabel, { color: theme.text }]}>
                    {UNIT_LABELS[event.unitType]}
                  </Text>
                </View>
                <Text style={[styles.logTime, { color: theme.icon }]}>
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Track History</Text>
      </View>
      <FlatList
        data={summaries}
        ListHeaderComponent={
          <>
            <ContributionGraph summaries={graphSummaries} theme={theme} />
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: theme.text }}
              >
                Recent History
              </Text>
              <Text style={{ fontSize: 13, color: theme.icon, opacity: 0.7 }}>
                Last 14 days of hydration
              </Text>
            </View>
          </>
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
