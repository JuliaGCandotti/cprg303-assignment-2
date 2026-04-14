import DiscoverCard from "@/components/discoverCard";
import HorizontalSection from "@/components/horizontalSection";
import WorkoutCard from "@/components/workoutCard";
import { getAllWorkouts, type Workout } from "@/data/workouts";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DAY_1_WORKOUT_ID = "lower-body-training";
const BEST_FOR_YOU_IDS = [
  "belly-fat-burner",
  "lose-fat",
  "plank",
  "build-wider-biceps",
];
const CHALLENGE_IDS = ["challenge-plank", "challenge-sprint", "challenge-squat"];

export default function PlanScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllWorkouts()
      .then(setWorkouts)
      .catch((e) => setError(e.message ?? "Failed to load workouts"))
      .finally(() => setLoading(false));
  }, []);

  const goToWorkout = (id: string) => {
    router.push({ pathname: "/workout/[id]", params: { id } });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  const day1 = workouts.find((w) => w.id === DAY_1_WORKOUT_ID);
  const bestForYou = workouts.filter((w) => BEST_FOR_YOU_IDS.includes(w.id));
  const challenges = workouts.filter((w) => CHALLENGE_IDS.includes(w.id));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>FitMate</Text>

      {/* DAY 1 — featured card stays inline (custom layout) */}
      {day1 && (
        <Pressable style={styles.dayCard} onPress={() => goToWorkout(day1.id)}>
          <Image source={day1.image} style={styles.dayImage} resizeMode="cover" />
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
      )}

      {/* Best for you — uses DiscoverCard (2-col grid) */}
      <Text style={styles.sectionTitle}>Best for you</Text>
      <View style={styles.grid}>
        {bestForYou.map((workout) => (
          <DiscoverCard
            key={workout.id}
            program={{
              id: workout.id,
              title: workout.title,
              durationMinutes: workout.durationMinutes,
              level: workout.level,
              image: workout.image,
            }}
          />
        ))}
      </View>

      {/* Challenges — uses WorkoutCard (horizontal row) */}
      <HorizontalSection title="Challenge">
        {challenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeWrap}>
            <WorkoutCard
              id={challenge.id}
              image={challenge.image}
              title={challenge.title}
              durationMinutes={challenge.durationMinutes}
              exercises={challenge.exercises}
              level={challenge.level}
              kcal={challenge.kcal}
              description={challenge.description}
            />
          </View>
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
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 20,
  },
  dayCard: { borderRadius: theme.radius.card, overflow: "hidden", marginBottom: 28, height: 220 },
  dayImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  dayOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,182,193,0.55)",
    padding: theme.spacing.card,
    justifyContent: "space-between",
  },
  dayTitle: { fontSize: 42, fontWeight: "900", color: theme.colors.white },
  daySubtitle: { fontSize: theme.fontSize.subtitle, color: theme.colors.white, fontWeight: "600" },
  startButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: "center",
  },
  startText: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.text },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 14,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 28 },
  challengeWrap: { width: 280, marginRight: 12 },
});