import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { getActiveMascots } from "./mascots";
import { MascotCategory } from "./mascots/types";
import { SegmentedControl } from "./ui/SegmentedControl";
import { WaterBottle } from "./WaterBottle";

interface MascotPickerProps {
  currentMascotType: string;
  onSelect: (type: string) => void;
  theme: any;
}

const ITEMS_PER_PAGE = 6;
const CATEGORIES: MascotCategory[] = ["Classic", "Nature", "Vessels", "Zen"];

export const MascotPicker = ({
  currentMascotType,
  onSelect,
  theme,
}: MascotPickerProps) => {
  const [activeCategory, setActiveCategory] =
    useState<MascotCategory>("Classic");
  const [currentPage, setCurrentPage] = useState(0);

  const mascots = useMemo(() => getActiveMascots(), []);

  const filteredMascots = useMemo(() => {
    return mascots.filter((m) => m.category === activeCategory);
  }, [mascots, activeCategory]);

  const totalPages = Math.ceil(filteredMascots.length / ITEMS_PER_PAGE);
  const currentItems = filteredMascots.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Selection */}
      <View style={styles.categoryContainer}>
        <SegmentedControl
          options={CATEGORIES}
          value={activeCategory}
          onSelect={(val) => setActiveCategory(val as MascotCategory)}
          theme={theme}
        />
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <Animated.View
          key={`${activeCategory}-${currentPage}`}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          layout={Layout.springify()}
          style={styles.grid}
        >
          {currentItems.map((mascot) => (
            <TouchableOpacity
              key={mascot.type}
              style={[
                styles.bottleOption,
                {
                  backgroundColor: theme.secondaryBackground,
                  borderColor:
                    currentMascotType === mascot.type
                      ? theme.tint
                      : "transparent",
                },
                currentMascotType === mascot.type && {
                  backgroundColor: theme.tint + "10",
                },
              ]}
              onPress={() => onSelect(mascot.type)}
              activeOpacity={0.7}
            >
              <View style={styles.bottlePreview}>
                <WaterBottle
                  mood="happy"
                  fillLevel={0.6}
                  size={42}
                  type={mascot.type}
                  showDialogue={false}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.bottleLabel,
                  { color: theme.text },
                  currentMascotType === mascot.type && {
                    color: theme.tint,
                    fontWeight: "700",
                  },
                ]}
              >
                {mascot.name}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Fill empty spaces to maintain grid layout if needed */}
          {[...Array(ITEMS_PER_PAGE - currentItems.length)].map((_, i) => (
            <View
              key={`empty-${i}`}
              style={[styles.bottleOption, { opacity: 0 }]}
            />
          ))}
        </Animated.View>
      </View>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={currentPage === 0}
            style={[
              styles.paginationButton,
              { opacity: currentPage === 0 ? 0.3 : 1 },
            ]}
          >
            <ChevronLeft size={20} color={theme.tint} />
          </TouchableOpacity>

          <View style={styles.pageDots}>
            {[...Array(totalPages)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentPage === i ? theme.tint : theme.icon + "40",
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNextPage}
            disabled={currentPage === totalPages - 1}
            style={[
              styles.paginationButton,
              { opacity: currentPage === totalPages - 1 ? 0.3 : 1 },
            ]}
          >
            <ChevronRight size={20} color={theme.tint} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  categoryContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  gridContainer: {
    minHeight: 240,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  bottleOption: {
    width: "30%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  bottlePreview: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  bottleLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  paginationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  pageDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
