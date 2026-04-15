import { theme } from "@/styles/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FoodCalendar from "@/components/foodCalendar";
// TODO: implement Diary screen
export default function DiaryScreen() {
  return (
    <ScrollView style={styles.container}>
      <FoodCalendar selected={new Date()} />
      <View style={styles.topBar}>
        <Text style={styles.title}>My Diary </Text>
        <Text style={styles.subtitle}>Track your meals and nutrition</Text>
      </View>
      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
        <View style={styles.nutritionBar}>
          <View style={[styles.nutritionFill, { width: "50%" }]} />
        </View>
        <Text style={styles.nutritionInfo}>Calories: 200</Text>
      </View>
      {/* Meal details - meal logs */}
      <View style={styles.mealLogsContainer}>
        <Text style={styles.title}>Today Meals</Text>
        <View style={styles.mealCard}>
          <Text>Breakfast: Oatmeal</Text>
        </View>
        <View style={styles.mealCard}>
          <Text>Lunch: Salad</Text>
        </View>
        <View style={styles.mealCard}>
          <Text>Dinner: Grilled Chicken</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.card,
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
  mealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 16,
    width: "100%",
  },
  mealPhoto: {
    width: "100%",
    height: 200,
    borderRadius: theme.radius.card,
    marginBottom: theme.spacing.gap,
  },
});
