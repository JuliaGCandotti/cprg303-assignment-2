import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/styles/theme";
import { FoodLog } from "@/data/foodlogs";

export interface DayCell {
  day: number | null;
  date: Date | null;
  foodLog: FoodLog | null;
}

export interface DayCellProps {
  cell: DayCell;
  isToday: boolean;
  onPress: () => void;
  foodLogCount?: number;
}
const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 32 - 6 * 4) / 7);

const DayCellView: React.FC<DayCellProps> = ({
  cell,
  isToday,
  onPress,
  foodLogCount = 0,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (cell.date) {
      const dateString = cell.date.toISOString();
      router.push({
        pathname: "/diary/[id]",
        params: { id: dateString, dateString: dateString },
      });
    }
  };
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
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Show day number only if there's no log, otherwise show the food photo as
      the main visual */}
      {!hasLog && (
        <Text
          style={[
            styles.dayNumText,
            isToday && {
              color: todayBorderColor,
              fontWeight: "700",
            },
          ]}
        >
          {cell.day}
        </Text>
      )}

      {hasLog && cell.foodLog && (
        <View style={styles.foodIndicator}>
          {cell.foodLog.imageUrl ? (
            <Image source={cell.foodLog.imageUrl} style={styles.foodImage} />
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

      {/* Food log count badge */}
      {foodLogCount > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{foodLogCount}</Text>
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
  countBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
