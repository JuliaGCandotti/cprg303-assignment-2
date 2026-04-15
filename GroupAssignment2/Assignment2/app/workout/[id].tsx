import { getWorkoutById, type Workout } from "@/data/workouts";
import { supabase } from "@/lib/supabase";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
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

type TimerState = "idle" | "running" | "paused" | "done";

type ExerciseLogEntry = {
  local_id: string;
  name: string;
  time_spent_seconds: number;
  completed: boolean;
};

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [timerStates, setTimerStates] = useState<Record<string, TimerState>>({});
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  // Supabase session row: created on first interaction, updated on every change.
  const sessionLogId = useRef<string | null>(null);
  const userId = useRef<string | null>(null);
  const creatingSession = useRef<Promise<void> | null>(null);

  // Mirrors of latest state for syncing without stale closures.
  const timerStatesRef = useRef<Record<string, TimerState>>({});
  const timeSpentRef = useRef<Record<string, number>>({});
  const intervals = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workoutRef = useRef<Workout | null>(null);

  useEffect(() => { timerStatesRef.current = timerStates; }, [timerStates]);
  useEffect(() => { timeSpentRef.current = timeSpent; }, [timeSpent]);
  useEffect(() => { workoutRef.current = workout; }, [workout]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getWorkoutById(id)
      .then((w) => setWorkout(w))
      .catch((e) => setLoadError(e.message ?? "Failed to load workout"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      userId.current = data.user?.id ?? null;
    });
  }, []);

  // Resume an existing INCOMPLETE session for this workout if one exists.
  // Only runs once after workout is loaded.
  useEffect(() => {
    const resumeIfPossible = async () => {
      if (!workout) return;
      if (sessionLogId.current) return;

      // make sure we have the user (in case the other effect hasn't finished)
      if (!userId.current) {
        const { data } = await supabase.auth.getUser();
        userId.current = data.user?.id ?? null;
      }
      if (!userId.current) return;

      const { data, error } = await supabase
        .from("workout_logs")
        .select("id, exercises_done, exercise_log")
        .eq("user_id", userId.current)
        .eq("workout_id", workout.id)
        .order("completed_at", { ascending: false })
        .limit(5);

      if (error || !data) return;

      // Find the most recent row that is NOT fully complete.
      const incomplete = data.find((row: any) => {
        const log = row.exercise_log ?? [];
        const total = Array.isArray(log) ? log.length : 0;
        return total === 0 || (row.exercises_done ?? 0) < total;
      });

      if (!incomplete) return;

      // Rehydrate local state from the saved row
      sessionLogId.current = incomplete.id;
      const log = (incomplete.exercise_log ?? []) as ExerciseLogEntry[];
      const states: Record<string, TimerState> = {};
      const spent: Record<string, number> = {};
      log.forEach((e) => {
        states[e.local_id] = e.completed ? "done" : "idle";
        spent[e.local_id] = e.time_spent_seconds ?? 0;
      });
      setTimerStates(states);
      setTimeSpent(spent);
    };

    resumeIfPossible();
  }, [workout]);

  // Cleanup: clear timers and flush any pending changes when leaving the screen.
  useEffect(() => {
    return () => {
      Object.values(intervals.current).forEach(clearInterval);
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
      flushSync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Supabase sync ----------

  const buildPayload = () => {
    const w = workoutRef.current;
    if (!w) return null;
    const exerciseLog: ExerciseLogEntry[] = w.exercises.map((ex) => ({
      local_id: ex.id,
      name: ex.name,
      time_spent_seconds: timeSpentRef.current[ex.id] ?? 0,
      completed: (timerStatesRef.current[ex.id] ?? "idle") === "done",
    }));
    const totalSeconds = exerciseLog.reduce((s, e) => s + e.time_spent_seconds, 0);
    const exercisesDone = exerciseLog.filter((e) => e.completed).length;
    return { exerciseLog, totalSeconds, exercisesDone };
  };

  // INSERT the row the first time we touch the workout.
  const ensureSession = async () => {
    if (sessionLogId.current) return;
    if (creatingSession.current) return creatingSession.current;
    if (!workoutRef.current || !userId.current) return;

    creatingSession.current = (async () => {
      const payload = buildPayload();
      if (!payload) return;

      const { data, error } = await supabase
        .from("workout_logs")
        .insert({
          user_id: userId.current,
          workout_id: workoutRef.current!.id,
          total_seconds: payload.totalSeconds,
          exercises_done: payload.exercisesDone,
          exercise_log: payload.exerciseLog,
        })
        .select("id")
        .single();

      if (!error && data) {
        sessionLogId.current = data.id;
      } else if (error) {
        console.warn("workout_logs insert failed:", error.message);
      }
    })();

    await creatingSession.current;
    creatingSession.current = null;
  };

  // UPDATE the row in place with the latest state.
  const flushSync = async () => {
    if (!workoutRef.current || !userId.current) return;
    if (!sessionLogId.current) {
      await ensureSession();
      if (!sessionLogId.current) return;
    }

    const payload = buildPayload();
    if (!payload) return;

    const { error } = await supabase
      .from("workout_logs")
      .update({
        total_seconds: payload.totalSeconds,
        exercises_done: payload.exercisesDone,
        exercise_log: payload.exerciseLog,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionLogId.current);

    if (error) console.warn("workout_logs update failed:", error.message);
  };

  // Debounced background save for per-second time tracking.
  // Round completions call flushSync directly so they're saved immediately.
  const scheduleSync = () => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => flushSync(), 4000);
  };

  // ---------- timer ----------

  const startTicking = (exerciseId: string) => {
    if (intervals.current[exerciseId]) clearInterval(intervals.current[exerciseId]);

    intervals.current[exerciseId] = setInterval(() => {
      setTimeLeft((prev) => {
        const current = prev[exerciseId] ?? 0;

        setTimeSpent((s) => ({
          ...s,
          [exerciseId]: (s[exerciseId] ?? 0) + 1,
        }));

        if (current <= 1) {
          // exercise just completed naturally — save immediately
          clearInterval(intervals.current[exerciseId]);
          delete intervals.current[exerciseId];
          setTimerStates((st) => ({ ...st, [exerciseId]: "done" }));
          setTimeout(() => flushSync(), 0);
          return { ...prev, [exerciseId]: 0 };
        }

        scheduleSync(); // background save while running
        return { ...prev, [exerciseId]: current - 1 };
      });
    }, 1000);
  };

  const handlePlayPress = (exerciseId: string, durationSeconds: number) => {
    const state = timerStates[exerciseId] ?? "idle";

    if (state === "running") {
      // pause — keep remaining
      clearInterval(intervals.current[exerciseId]);
      delete intervals.current[exerciseId];
      setTimerStates((p) => ({ ...p, [exerciseId]: "paused" }));
      setTimeout(() => flushSync(), 0);
      return;
    }

    if (state === "paused") {
      // resume from current remaining
      setTimerStates((p) => ({ ...p, [exerciseId]: "running" }));
      startTicking(exerciseId);
      ensureSession();
      return;
    }

    // idle or done -> fresh start
    setTimeLeft((p) => ({ ...p, [exerciseId]: durationSeconds }));
    setTimerStates((p) => ({ ...p, [exerciseId]: "running" }));
    startTicking(exerciseId);
    ensureSession();
  };

  const handleToggleComplete = (exerciseId: string, durationSeconds: number) => {
    const state = timerStates[exerciseId] ?? "idle";

    if (state === "done") {
      setTimerStates((p) => ({ ...p, [exerciseId]: "idle" }));
      setTimeLeft((p) => ({ ...p, [exerciseId]: durationSeconds }));
      setTimeout(() => flushSync(), 0);
      return;
    }

    if (intervals.current[exerciseId]) {
      clearInterval(intervals.current[exerciseId]);
      delete intervals.current[exerciseId];
    }
    setTimerStates((p) => ({ ...p, [exerciseId]: "done" }));
    setTimeLeft((p) => ({ ...p, [exerciseId]: 0 }));
    ensureSession();
    setTimeout(() => flushSync(), 0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---------- views ----------

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

  const allDone =
    workout.exercises.length > 0 &&
    workout.exercises.every((ex) => (timerStates[ex.id] ?? "idle") === "done");

  const handleFinishAndExit = async () => {
    await flushSync();
    setCompleted(true);
    Alert.alert("Workout saved 🎉", `${workout.title} is in your Progress.`, [
      { text: "Back to Plan", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          const isPaused = state === "paused";

          let label: string;
          if (isRunning || isPaused) {
            const elapsed = exercise.durationSeconds - remaining;
            const suffix = isPaused ? " · Paused" : "";
            label = `${formatTime(elapsed)} / ${formatTime(exercise.durationSeconds)}${suffix}`;
          } else if (isDone) {
            label = `Done · ${formatTime(timeSpent[exercise.id] ?? exercise.durationSeconds)}`;
          } else {
            label = formatTime(exercise.durationSeconds);
          }

          const iconName = isRunning ? "pause" : isDone ? "refresh" : "play";

          return (
            <View
              key={exercise.id}
              style={[
                styles.exerciseCard,
                isDone && styles.exerciseCardDone,
                (isRunning || isPaused) && styles.exerciseCardRunning,
              ]}
            >
              <Pressable
                style={[styles.checkbox, isDone && styles.checkboxDone]}
                onPress={() => handleToggleComplete(exercise.id, exercise.durationSeconds)}
                hitSlop={8}
              >
                {isDone && <Ionicons name="checkmark" size={16} color="#fff" />}
              </Pressable>

              <Image source={exercise.image} style={styles.exerciseImage} resizeMode="cover" />
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, isDone && styles.exerciseNameDone]}>
                  {exercise.name}
                </Text>
                <Text style={[styles.exerciseDuration, isDone && styles.exerciseDurationDone]}>
                  {label}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.startButton,
                  isDone && styles.startButtonDone,
                  isRunning && styles.startButtonRunning,
                ]}
                onPress={() => handlePlayPress(exercise.id, exercise.durationSeconds)}
              >
                <Ionicons name={iconName} size={20} color={theme.colors.white} />
              </Pressable>
            </View>
          );
        })}

        <Pressable
          style={[
            styles.completeButton,
            (completed || allDone) && styles.completeButtonDone,
          ]}
          onPress={handleFinishAndExit}
          disabled={completed}
        >
          <Ionicons
            name={completed || allDone ? "checkmark-circle" : "trophy-outline"}
            size={20}
            color={theme.colors.white}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.completeButtonText}>
            {completed ? "Saved!" : allDone ? "Finish & Exit" : "Finish Early"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  errorContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    padding: theme.spacing.screen, backgroundColor: theme.colors.bg,
  },
  errorText: { fontSize: theme.fontSize.section, color: theme.colors.text, marginBottom: 12 },
  errorBack: { fontSize: theme.fontSize.card, color: theme.colors.primary },
  heroContainer: { width: "100%", height: 280, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  backButton: {
    position: "absolute", top: 48, left: 16,
    backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20, padding: 8,
  },
  statsPill: {
    position: "absolute", bottom: -28, alignSelf: "center",
    backgroundColor: theme.colors.white, borderRadius: 20,
    flexDirection: "row", paddingVertical: 14, paddingHorizontal: 32,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, gap: 32,
  },
  pillStat: { alignItems: "center", gap: 2 },
  pillLabel: { fontSize: 11, color: theme.colors.muted },
  pillValue: { fontSize: 14, fontWeight: "700", color: theme.colors.text },
  pillDivider: { width: 1, backgroundColor: theme.colors.border },
  content: { padding: theme.spacing.screen, paddingTop: 44 },
  title: { fontSize: theme.fontSize.title, fontWeight: "800", color: theme.colors.text, marginBottom: 12 },
  description: { fontSize: theme.fontSize.card, color: theme.colors.muted, lineHeight: 22, marginBottom: 28 },
  sectionTitle: {
    fontSize: theme.fontSize.section, fontWeight: "800", color: theme.colors.text,
    marginBottom: 16, paddingTop: 8, borderTopWidth: 1, borderColor: theme.colors.border,
  },
  exerciseCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.radius.card,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border,
  },
  exerciseCardDone: { backgroundColor: "#d1fae5", borderColor: "#6ee7b7" },
  exerciseCardRunning: { borderColor: theme.colors.primary, borderWidth: 2 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2,
    borderColor: theme.colors.border, backgroundColor: "transparent",
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  checkboxDone: { backgroundColor: "#059669", borderColor: "#059669" },
  exerciseImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: theme.colors.border },
  exerciseInfo: { flex: 1, marginLeft: 12 },
  exerciseName: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.text },
  exerciseNameDone: { color: "#065f46" },
  exerciseDuration: {
    fontSize: theme.fontSize.subtitle, color: theme.colors.muted,
    marginTop: 4, fontVariant: ["tabular-nums"],
  },
  exerciseDurationDone: { color: "#065f46" },
  startButton: {
    backgroundColor: theme.colors.primary, borderRadius: 22,
    width: 44, height: 44, justifyContent: "center", alignItems: "center",
  },
  startButtonRunning: { backgroundColor: "#dc2626" },
  startButtonDone: { backgroundColor: "#059669" },
  completeButton: {
    flexDirection: "row", backgroundColor: theme.colors.button,
    borderRadius: theme.radius.button, padding: 18,
    alignItems: "center", justifyContent: "center",
    marginTop: 8, marginBottom: 40,
  },
  completeButtonDone: { backgroundColor: "#059669" },
  completeButtonText: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.white },
});