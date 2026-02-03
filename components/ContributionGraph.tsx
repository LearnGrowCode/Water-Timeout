import { DailySummary } from '@/lib/hydration-store';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ContributionGraphProps {
  summaries: DailySummary[];
  theme: any;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLUMN_WIDTH = 22; // 16px square + 6px gap

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ summaries, theme }) => {
  // Summaries are newest to oldest.
  // To build a proper GitHub-style graph, we need to align days to their actual day of the week.
  
  const generateGrid = () => {
    if (summaries.length === 0) return [];

    const data = [...summaries];
    const grid: (DailySummary | null)[][] = [];
    
    // 1. Determine the first day's day-of-week
    const firstDay = new Date(data[0].date);
    const firstDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    // 2. Pad the beginning to start from Sunday
    let currentDayIndex = 0;
    let currentWeek: (DailySummary | null)[] = [];
    
    // Fill leading empty days
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Fill actual data
    while (currentDayIndex < data.length) {
      currentWeek.push(data[currentDayIndex]);
      currentDayIndex++;
      
      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill trailing empty days for the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      grid.push(currentWeek);
    }
    
    return grid;
  };

  const weeks = generateGrid();

  const getIntensityColor = (summary: DailySummary | null) => {
    if (!summary || summary.totalPoints === 0) return theme.secondaryBackground;
    const percentage = summary.totalPoints / summary.target;
    
    // In dark mode, theme.tint is often white. Use bottle color for better visuals.
    const baseColor = theme.bottle.okay; 
    
    if (percentage >= 1) return baseColor;
    if (percentage >= 0.75) return baseColor + 'CC'; 
    if (percentage >= 0.5) return baseColor + '99';  
    if (percentage >= 0.25) return baseColor + '66'; 
    if (percentage > 0) return baseColor + '33';
    return theme.secondaryBackground;
  };

  const getMonthLabels = () => {
    const labels: { label: string; offset: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, index) => {
      // Find first non-null day in week to get month
      const firstValidDay = week.find(d => d !== null);
      if (firstValidDay) {
        const month = new Date(firstValidDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTHS[month], offset: index });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Hydration Activity</Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>Goal intensity graph</Text>
      </View>

      <View style={styles.graphWrapper}>
        {/* Day Labels */}
        <View style={styles.dayLabels}>
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
            <Text key={`day-label-${i}`} style={[styles.dayLabelText, { color: theme.icon }]}>
              {day}
            </Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View>
            {/* Month Labels */}
            <View style={styles.monthLabelsRow}>
              {monthLabels.map((ml, i) => (
                <Text 
                  key={`month-${i}`} 
                  style={[
                    styles.monthLabelText, 
                    { color: theme.icon, left: ml.offset * COLUMN_WIDTH }
                  ]}
                >
                  {ml.label}
                </Text>
              ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
              {weeks.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.weekColumn}>
                  {week.map((day, dayIndex) => {
                    const percentage = day ? day.totalPoints / day.target : 0;
                    const isPerfect = percentage >= 1;
                    const baseColor = theme.bottle.okay;
                    return (
                      <View 
                        key={`day-${weekIndex}-${dayIndex}`} 
                        style={[
                          styles.daySquare, 
                          { 
                            backgroundColor: getIntensityColor(day),
                            borderColor: isPerfect ? baseColor : 'transparent',
                            borderWidth: isPerfect ? 1 : 0
                          }
                        ]} 
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: theme.icon }]}>Less</Text>
          <View style={[styles.daySquare, { backgroundColor: theme.secondaryBackground }]} />
          <View style={[styles.daySquare, { backgroundColor: theme.bottle.okay + '33' }]} />
          <View style={[styles.daySquare, { backgroundColor: theme.bottle.okay + '66' }]} />
          <View style={[styles.daySquare, { backgroundColor: theme.bottle.okay + '99' }]} />
          <View style={[styles.daySquare, { backgroundColor: theme.bottle.okay }]} />
          <Text style={[styles.legendText, { color: theme.icon }]}>More</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: -16, 
    marginBottom: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  graphWrapper: {
    flexDirection: 'row',
  },
  dayLabels: {
    paddingTop: 36,
    marginRight: 12,
    width: 28,
  },
  dayLabelText: {
    fontSize: 10,
    height: 22, // 16px square + 6px gap
    fontWeight: '700',
    textAlignVertical: 'center',
    opacity: 0.5,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  monthLabelsRow: {
    height: 22,
    position: 'relative',
    marginBottom: 14,
  },
  monthLabelText: {
    fontSize: 11,
    position: 'absolute',
    fontWeight: '700',
    opacity: 0.8,
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
  },
  weekColumn: {
    gap: 6,
  },
  daySquare: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    marginHorizontal: 4,
  }
});
