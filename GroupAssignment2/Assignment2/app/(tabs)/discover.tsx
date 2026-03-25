import DiscoverCard from "@/components/discoverCard";
import { theme } from "@/styles/theme";
import { WORKOUTS } from "@/data/workouts";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const CATEGORY_LABELS: Record<string, string> = {
  abs: "Abs & Core",
  cardio: "Cardio & Fat Loss",
  arms: "Arms & Upper Body",
  legs: "Legs & Glutes",
  "full-body": "Full Body",
  challenge: "Challenges",
};

// Group workouts by category, excluding challenges from main list
const mainWorkouts = WORKOUTS.filter((w) => w.category !== "challenge");

const grouped = mainWorkouts.reduce<Record<string, typeof mainWorkouts>>(
  (acc, workout) => {
    const cat = workout.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(workout);
    return acc;
  },
  {}
);

export default function Discover() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Discover</Text>

      {Object.entries(grouped).map(([category, workouts]) => (
        <View key={category} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {CATEGORY_LABELS[category] ?? category}
            </Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <View style={styles.grid}>
            {workouts.map((workout) => (
              <DiscoverCard key={workout.id} program={workout} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.screen,
  },
  header: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
