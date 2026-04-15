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
const BEST_FOR_YOU_IDS = ["belly-fat-burner", "lose-fat", "plank", "build-wider-biceps"];
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

  const goToWorkout = (id: string) =>
    router.push({ pathname: "/workout/[id]", params: { id } });

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

      {/* DAY 1 */}
      {day1 && (
        <Pressable style={styles.dayCard} onPress={() => goToWorkout(day1.id)}>
          <Image source={day1.image} style={styles.dayImage} resizeMode="cover" />
          <View style={styles.dayOverlay}>
            <View>
              <Text style={styles.dayTitle}>DAY 1</Text>
              <Text style={styles.daySubtitle}>
                {day1.durationMinutes} min | {day1.exercises.length} exercises
              </Text>
            </View>
            <Pressable style={styles.startButton} onPress={() => goToWorkout(day1.id)}>
              <Text style={styles.startText}>Start</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      {/* Best for you — grid compacto */}
      <Text style={styles.sectionTitle}>Best for you</Text>
      <View style={styles.grid}>
        {bestForYou.map((workout) => (
          <Pressable
            key={workout.id}
            style={styles.gridCard}
            onPress={() => goToWorkout(workout.id)}
          >
            <Image source={workout.image} style={styles.gridImage} resizeMode="cover" />
            <Text style={styles.gridTitle} numberOfLines={1}>
              {workout.title}
            </Text>
            <View style={styles.gridTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{workout.level}</Text>
              </View>
              <Text style={styles.tagDot}>·</Text>
              <Text style={styles.tagPlain}>{workout.durationMinutes} min</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Challenge — cards compactos horizontais, sem "See all" */}
      <Text style={styles.sectionTitle}>Challenge</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.challengeScroll}
      >
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
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle} numberOfLines={1}>
                {challenge.title}
              </Text>
              <Text style={styles.challengeSub}>
                {challenge.durationMinutes} min · {challenge.exercises.length} exercises
              </Text>
              <Text style={styles.challengeLevel}>{challenge.level}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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

  // DAY 1
  dayCard: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
    marginBottom: 28,
    height: 220,
  },
  dayImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  dayOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,182,193,0.55)",
    padding: theme.spacing.card,
    justifyContent: "space-between",
  },
  dayTitle: { fontSize: 42, fontWeight: "900", color: theme.colors.white },
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

  // Best for you
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
  gridCard: { width: "48%", marginBottom: 16 },
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
    marginBottom: 4,
  },
  gridTags: { flexDirection: "row", alignItems: "center", gap: 4 },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 11, color: theme.colors.primary, fontWeight: "600" },
  tagDot: { fontSize: 11, color: theme.colors.muted },
  tagPlain: { fontSize: 11, color: theme.colors.muted },

  // Challenges
  challengeScroll: { gap: 12, paddingBottom: 24 },
  challengeCard: {
    width: 200,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  challengeImage: { width: "100%", height: 90 },
  challengeInfo: { padding: 10 },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 2,
  },
  challengeSub: { fontSize: 11, color: theme.colors.muted, marginBottom: 4 },
  challengeLevel: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
