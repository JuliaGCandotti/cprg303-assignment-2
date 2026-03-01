import DiscoverCard from "@/components/discoverCard";
import { theme } from "@/styles/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const workouts = [
  {
    id: "1",
    title: "Full Body Pilates & Fat Burn",
    duration: "17",
    numberOfExercises: "12",
    level: "Intermediate",
    kcal: "220",
    description: "A full body pilates workout designed to burn fat and tone muscles.",
    category: "weight-loss",
    image: { uri: "https://img.freepik.com/free-photo/woman-practising-yoga_1303-13982.jpg" },
    },
  {
    id: "2",
    title: "Fastest Fat Burning",
    duration: "11",
    numberOfExercises: "8",
    level: "Beginner",
    kcal: "150",
    description: "Quick and effective fat burning routine for beginners.",
    category: "weight-loss",
    image: {uri :"https://img.freepik.com/free-photo/sid-view-overweight-obese-young-woman-wearing-t-shirt-leggings-doing-physical-training-mat-strengthen-legs-arms-abs-spine-weght-loss-fitness-sports-active-lifestyle-concept_344912-44.jpg"},
  },
  {
    id: "3",
    title: "Home Pilates for Tension Relief",
    duration: "12",
    numberOfExercises: "10",
    level: "Advanced",
    kcal: "180",
    description: "Release tension and stress with this calming pilates session.",
    category: "stretching",
    image: {uri : "https://img.freepik.com/free-photo/woman-doing-her-workout-home_23-2148995612.jpg"},
  },
  {
    id: "4",
    title: "Good Morning Stretch",
    duration: "6",
    numberOfExercises: "6",
    level: "Beginner",
    kcal: "80",
    description: "Start your day right with a gentle morning stretch routine.",
    category: "stretching",
    image: {uri: "https://img.freepik.com/free-photo/woman-stretching-arms-up-by-window-sunrise-with-sun-flare_41433-205.jpg"},
  },
];

export default function Discover() {
  const weightLoss = workouts.filter((w) => w.category === "weight-loss");
  const stretching = workouts.filter((w) => w.category === "stretching");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Discover</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weight Loss Journey</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.grid}>
          {weightLoss.map((workout) => (
            <DiscoverCard key={workout.id} program={workout} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stretching & Warm-up</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.grid}>
          {stretching.map((workout) => (
            <DiscoverCard key={workout.id} program={workout} />
          ))}
        </View>
      </View>
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