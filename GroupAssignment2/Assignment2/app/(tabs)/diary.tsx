import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FoodCalendar from "@/components/foodCalendar";
// TODO: implement Diary screen
export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <FoodCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 24,
    width: "100%",
    // maxWidth: 400,
  },
  nutritionTitle: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  nutritionBar: {
    height: 20,
    backgroundColor: theme.colors.border,
    borderRadius: 50,
    overflow: "hidden",
  },
  nutritionFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  nutritionInfo: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.card,
  },
});
