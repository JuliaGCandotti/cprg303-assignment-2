import { theme } from "@/styles/theme";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FoodCalendar from "@/components/foodCalendar";
import FoodCard from "@/components/foodCard";
import { FoodLog, initialFoodLogs } from "@/data/foodlogs";
// TODO: implement Diary screen
export default function DiaryScreen() {
  const today = new Date();

  // Get today's food logs
  const todayFoodLogs = useMemo(() => {
    return initialFoodLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === today.toDateString();
    });
  }, []);

  // Calculate total nutrition for today
  const todayNutrition = useMemo(() => {
    return todayFoodLogs.reduce<{
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
    }>(
      (acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        carbs: acc.carbs + (log.carbs || 0),
        protein: acc.protein + (log.protein || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
  }, [todayFoodLogs]);

  const caloriePercentage = Math.min(
    (todayNutrition.calories / 2000) * 100,
    100,
  );
  return (
    <ScrollView style={styles.container}>
      <FoodCalendar selected={today} />
      <View style={styles.topBar}>
        <Text style={styles.title}>My Diary </Text>
        <Text style={styles.subtitle}>Track your meals and nutrition</Text>
      </View>
      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
        <View style={styles.nutritionBar}>
          <View
            style={[styles.nutritionFill, { width: `${caloriePercentage}%` }]}
          />
        </View>
        <Text style={styles.nutritionInfo}>
          Calories: {todayNutrition.calories} / 2000 kcal
        </Text>
        <View style={styles.macroInfo}>
          <Text style={styles.macroText}>Carbs: {todayNutrition.carbs}g</Text>
          <Text style={styles.macroText}>
            Protein: {todayNutrition.protein}g
          </Text>
          <Text style={styles.macroText}>Fat: {todayNutrition.fat}g</Text>
        </View>
      </View>

      {/* Meal details - meal logs */}
      {todayFoodLogs.length > 0 ? (
        <View style={styles.mealLogsContainer}>
          <Text style={styles.mealLogsTitle}>Today's Meals</Text>
          {todayFoodLogs.map((log) => (
            <FoodCard
              key={log.id}
              title={log.title}
              image_url={log.imageUrl}
              calories={log.calories}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals logged yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first meal to get started!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.card,
    paddingVertical: 2,
  },
  topBar: {
    marginBottom: 8,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
    marginTop: 8,
  },
  nutritionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 16,
    marginTop: theme.spacing.gap,
    width: "100%",
  },
  nutritionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  nutritionBar: {
    height: 5,
    backgroundColor: theme.colors.border,
    borderRadius: 50,
    overflow: "hidden",
  },
  nutritionFill: {
    height: "100%",
    backgroundColor: theme.colors.button,
  },
  nutritionInfo: {
    marginTop: 8,
    color: theme.colors.muted,
    fontSize: theme.fontSize.card,
  },
  mealLogsContainer: {
    flexDirection: "column",
    gap: theme.spacing.gap,
    marginTop: theme.spacing.gap,
  },
  mealLogsTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  macroInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  macroText: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginTop: theme.spacing.gap,
  },
  emptyText: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colors.text,
  },
  emptySubtext: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
    marginTop: 8,
  },
});
