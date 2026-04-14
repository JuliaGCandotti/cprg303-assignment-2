import { getWorkoutById, type Workout } from "@/data/workouts";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TimerState = "idle" | "running" | "done";

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [timerStates, setTimerStates] = useState<Record<string, TimerState>>({});
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const intervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getWorkoutById(id)
      .then((w) => setWorkout(w))
      .catch((e) => setLoadError(e.message ?? "Failed to load workout"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      Object.values(intervals.current).forEach(clearInterval);
    };
  }, []);

  // ---- loading / error / not-found states ----
  if (loading) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{loadError}</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.errorBack}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.errorBack}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  // ---- handlers ----
  const startTimer = (exerciseId: string, durationSeconds: number) => {
    if (timerStates[exerciseId] === "done") return;
    if (intervals.current[exerciseId]) {
      clearInterval(intervals.current[exerciseId]);
    }

    setTimerStates((prev) => ({ ...prev, [exerciseId]: "running" }));
    setTimeLeft((prev) => ({ ...prev, [exerciseId]: durationSeconds }));

    intervals.current[exerciseId] = setInterval(() => {
      setTimeLeft((prev) => {
        const current = prev[exerciseId];
        if (current <= 1) {
          clearInterval(intervals.current[exerciseId]);
          setTimerStates((s) => ({ ...s, [exerciseId]: "done" }));
          return { ...prev, [exerciseId]: 0 };
        }
        return { ...prev, [exerciseId]: current - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCompleteWorkout = async () => {
    try {
      const key = "completedWorkouts";
      const existing = await AsyncStorage.getItem(key);
      const list: { id: string; title: string; completedAt: string }[] = existing
        ? JSON.parse(existing)
        : [];

      const alreadyDone = list.some((w) => w.id === workout.id);
      if (!alreadyDone) {
        list.push({
          id: workout.id,
          title: workout.title,
          completedAt: new Date().toISOString(),
        });
        await AsyncStorage.setItem(key, JSON.stringify(list));
      }

      setCompleted(true);
      Alert.alert(
        "Workout Complete! 🎉",
        `${workout.title} has been added to your Progress.`,
        [{ text: "Back to Plan", onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert("Error", "Could not save your progress. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image source={workout.image} style={styles.heroImage} resizeMode="cover" />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.white} />
        </Pressable>

        <View style={styles.statsPill}>
          <View style={styles.pillStat}>
            <Ionicons name="time-outline" size={16} color={theme.colors.text} />
            <Text style={styles.pillLabel}>Time</Text>
            <Text style={styles.pillValue}>{workout.durationMinutes} min</Text>
          </View>
          <View style={styles.pillDivider} />
          <View style={styles.pillStat}>
            <Ionicons name="flame-outline" size={16} color={theme.colors.text} />
            <Text style={styles.pillLabel}>Burn</Text>
            <Text style={styles.pillValue}>{workout.kcal} kcal</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.description}>{workout.description}</Text>

        <Text style={styles.sectionTitle}>
          Rounds ({workout.exercises.length})
        </Text>

        {workout.exercises.map((exercise) => {
          const state = timerStates[exercise.id] ?? "idle";
          const remaining = timeLeft[exercise.id] ?? exercise.durationSeconds;
          const isDone = state === "done";
          const isRunning = state === "running";

          return (
            <View
              key={exercise.id}
              style={[styles.exerciseCard, isDone && styles.exerciseCardDone]}
            >
              <Image source={exercise.image} style={styles.exerciseImage} resizeMode="cover" />
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, isDone && styles.exerciseNameDone]}>
                  {exercise.name}
                </Text>
                <Text style={[styles.exerciseDuration, isDone && styles.exerciseDurationDone]}>
                  {isRunning || isDone
                    ? formatTime(remaining)
                    : formatTime(exercise.durationSeconds)}
                </Text>
              </View>
              <Pressable
                style={[styles.startButton, isDone && styles.startButtonDone]}
                onPress={() =>
                  !isDone && startTimer(exercise.id, exercise.durationSeconds)
                }
                disabled={isDone}
              >
                <Ionicons
                  name={isDone ? "checkmark" : "play"}
                  size={20}
                  color={theme.colors.white}
                />
              </Pressable>
            </View>
          );
        })}

        <Pressable
          style={[styles.completeButton, completed && styles.completeButtonDone]}
          onPress={handleCompleteWorkout}
          disabled={completed}
        >
          <Ionicons
            name={completed ? "checkmark-circle" : "trophy-outline"}
            size={20}
            color={theme.colors.white}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.completeButtonText}>
            {completed ? "Workout Completed!" : "Complete Workout"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  errorText: {
    fontSize: theme.fontSize.section,
    color: theme.colors.text,
    marginBottom: 12,
  },
  errorBack: { fontSize: theme.fontSize.card, color: theme.colors.primary },
  heroContainer: { width: "100%", height: 280, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  statsPill: {
    position: "absolute",
    bottom: -28,
    alignSelf: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 32,
  },
  pillStat: { alignItems: "center", gap: 2 },
  pillLabel: { fontSize: 11, color: theme.colors.muted },
  pillValue: { fontSize: 14, fontWeight: "700", color: theme.colors.text },
  pillDivider: { width: 1, backgroundColor: theme.colors.border },
  content: { padding: theme.spacing.screen, paddingTop: 44 },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseCardDone: { backgroundColor: "#d1fae5", borderColor: "#6ee7b7" },
  exerciseImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
  },
  exerciseInfo: { flex: 1, marginLeft: 12 },
  exerciseName: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
  exerciseNameDone: { color: "#065f46" },
  exerciseDuration: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  exerciseDurationDone: { color: "#065f46" },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonDone: { backgroundColor: "#059669" },
  completeButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.button,
    borderRadius: theme.radius.button,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  completeButtonDone: { backgroundColor: "#059669" },
  completeButtonText: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.white,
  },
});