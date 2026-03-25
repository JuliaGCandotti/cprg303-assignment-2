import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";
import { theme } from "@/styles/theme";
import HorizontalSection from "@/components/horizontalSection";
import WorkoutCard from "@/components/workoutCard";
import { WORKOUTS } from "@/data/workouts";

// The featured workout for DAY 1
const DAY_1_WORKOUT_ID = "lower-body-training";

// "Best for you" — picks from the workout data
const BEST_FOR_YOU_IDS = [
  "belly-fat-burner",
  "lose-fat",
  "plank",
  "build-wider-biceps",
];

// Challenges
const CHALLENGE_IDS = ["challenge-plank", "challenge-sprint", "challenge-squat"];

export default function PlanScreen() {
  const day1 = WORKOUTS.find((w) => w.id === DAY_1_WORKOUT_ID)!;
  const bestForYou = WORKOUTS.filter((w) => BEST_FOR_YOU_IDS.includes(w.id));
  const challenges = WORKOUTS.filter((w) => CHALLENGE_IDS.includes(w.id));

  const goToWorkout = (id: string) => {
    router.push({ pathname: "/workout/[id]", params: { id } });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.header}>FitMate</Text>

      {/* DAY 1 Card */}
      <Pressable style={styles.dayCard} onPress={() => goToWorkout(day1.id)}>
        <Image
          source={day1.image}
          style={styles.dayImage}
          resizeMode="cover"
        />
        <View style={styles.dayOverlay}>
          <View>
            <Text style={styles.dayTitle}>Current Workout</Text>
            <Text style={styles.daySubtitle}>
              {day1.durationMinutes} min | {day1.exercises.length} exercises
            </Text>
          </View>
          <Pressable
            style={styles.startButton}
            onPress={() => goToWorkout(day1.id)}
          >
            <Text style={styles.startText}>Start</Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Best for you */}
      <Text style={styles.sectionTitle}>Best for you</Text>
      <View style={styles.grid}>
        {bestForYou.map((workout) => (
          <Pressable
            key={workout.id}
            style={styles.gridCard}
            onPress={() => goToWorkout(workout.id)}
          >
            <Image
              source={workout.image}
              style={styles.gridImage}
              resizeMode="cover"
            />
            <Text style={styles.gridTitle} numberOfLines={1}>
              {workout.title}
            </Text>
            <View style={styles.gridTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{workout.durationMinutes} min</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{workout.level}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Challenges */}
      <HorizontalSection title="Challenge">
        {challenges.map((challenge) => (
          <Pressable
            key={challenge.id}
            style={styles.challengeCard}
            onPress={() => goToWorkout(challenge.id)}
          >
            <Image
              source={challenge.image}
              style={styles.challengeImage}
              resizeMode="cover"
            />
            <View style={styles.challengeOverlay}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
            </View>
          </Pressable>
        ))}
      </HorizontalSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 52,
  },
  header: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 20,
  },

  // DAY 1
  dayCard: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
    marginBottom: 28,
    height: 220,
  },
  dayImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dayOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,182,193,0.55)",
    padding: theme.spacing.card,
    justifyContent: "space-between",
  },
  dayTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: theme.colors.white,
  },
  daySubtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.white,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: "center",
  },
  startText: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },

  // Best for you grid
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  gridCard: {
    width: "48%",
    marginBottom: 16,
  },
  gridImage: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 6,
  },
  gridTags: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // Challenges
  challengeCard: {
    width: 140,
    height: 100,
    borderRadius: theme.radius.card,
    overflow: "hidden",
  },
  challengeImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  challengeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    padding: 10,
  },
  challengeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.white,
  },
});
