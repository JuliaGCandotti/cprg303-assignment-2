import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { theme } from "@/styles/theme";

export type FoodLog = {
  date: Date;
  url?: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

export interface DayCell {
  day: number | null;
  date: Date | null;
  foodLog: FoodLog | null;
}

export interface DayCellProps {
  cell: DayCell;
  isToday: boolean;
  onPress: () => void;
}
const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 32 - 6 * 4) / 7);

const DayCellView: React.FC<DayCellProps> = ({ cell, isToday, onPress }) => {
  if (!cell.day) {
    return <View style={[styles.dayCell, styles.emptyCell]} />;
  }

  const hasLog = cell.foodLog !== null;
  const logCalories = cell.foodLog?.calories ?? 0;
  const accentColor =
    logCalories > 500 ? theme.colors.error : theme.colors.primary;

  // Show today ring even without a log so the user always knows where "today" is
  const todayBorderColor = hasLog ? accentColor : theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        isToday && { borderColor: todayBorderColor, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Show day number only if there's no log, otherwise show the food photo as
      the main visual */}
      {!hasLog && (
        <Text
          style={[
            styles.dayNumText,
            isToday && { color: todayBorderColor, fontWeight: "700" },
          ]}
        >
          {cell.day}
        </Text>
      )}
      {hasLog && cell.foodLog && (
        <View style={styles.foodIndicator}>
          {cell.foodLog.url ? (
            <Image
              source={{ uri: cell.foodLog.url }}
              style={styles.foodImage}
            />
          ) : (
            // Fallback when no photo was taken — show a colour swatch
            <View
              style={[
                styles.foodImage,
                { backgroundColor: theme.colors.primary, opacity: 0.3 },
              ]}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
export default DayCellView;

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: 8,
    justifyContent: "space-between",
  },
  emptyCell: { backgroundColor: "transparent", borderWidth: 0 },
  dayNumText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  foodIndicator: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  foodImage: { width: "100%", height: "100%", resizeMode: "cover" },
});
