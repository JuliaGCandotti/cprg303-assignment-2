import { supabase } from "@/lib/supabase";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ---------- Types ----------
type Period = "W" | "M" | "Year";

type Workout = {
  id: string;
  title: string;
  level: string;
  duration_minutes: number;
  kcal: number;
  image_url: string;
};

type ExerciseLogEntry = {
  local_id: string;
  name: string;
  time_spent_seconds: number;
  completed: boolean;
};

type WorkoutLogRow = {
  id: string;
  workout_id: string;
  completed_at: string;
  exercises_done: number;
  total_seconds: number;
  exercise_log: ExerciseLogEntry[] | null;
  workouts: Workout | null;
};

type CompletedEntry = {
  logId: string;
  workout: Workout;
  completedAt: string;
  exercisesDone: number;
  exercisesTotal: number;
  totalSeconds: number;
  isFullyComplete: boolean;
};

const PERIODS: Period[] = ["W", "M", "Year"];

export default function ProgressScreen() {
  const [entries, setEntries] = useState<CompletedEntry[]>([]);
  const [activePeriod, setActivePeriod] = useState<Period>("M");
  const [loading, setLoading] = useState(true);

  const loadCompleted = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("workout_logs")
      .select(
        `id, workout_id, completed_at, exercises_done, total_seconds, exercise_log,
         workouts ( id, title, level, duration_minutes, kcal, image_url )`
      )
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .returns<WorkoutLogRow[]>();

    if (error || !data) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setEntries(
      data
        .filter((row): row is WorkoutLogRow & { workouts: Workout } => row.workouts !== null)
        .map((row) => {
          const total = row.exercise_log?.length ?? 0;
          const done = row.exercises_done ?? 0;
          return {
            logId: row.id,
            workout: row.workouts,
            completedAt: row.completed_at,
            exercisesDone: done,
            exercisesTotal: total,
            totalSeconds: row.total_seconds ?? 0,
            isFullyComplete: total > 0 && done >= total,
          };
        })
    );
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadCompleted(); }, [loadCompleted]));

  const now = useMemo(() => new Date(), []);
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  // Filter by period
  const filtered = useMemo(() => {
    return entries.filter(({ completedAt }) => {
      const date = new Date(completedAt);
      if (activePeriod === "W") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }
      if (activePeriod === "M") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }
      return date.getFullYear() === now.getFullYear();
    });
  }, [entries, activePeriod, now]);

  // Only count fully-completed sessions toward calorie totals.
  // Partial sessions get a pro-rated kcal estimate (done / total).
  const totalKcal = useMemo(
    () =>
      filtered.reduce((sum, e) => {
        if (e.isFullyComplete) return sum + (e.workout.kcal ?? 0);
        if (e.exercisesTotal === 0) return sum;
        return sum + Math.round((e.workout.kcal ?? 0) * (e.exercisesDone / e.exercisesTotal));
      }, 0),
    [filtered]
  );

  const completedCount = useMemo(
    () => filtered.filter((e) => e.isFullyComplete).length,
    [filtered]
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Progress</Text>

      <View style={styles.topRow}>
        <Text style={styles.monthTitle}>{monthName} {year}</Text>
        <View style={styles.periodRow}>
          {PERIODS.map(p => {
            const active = activePeriod === p;
            return (
              <Pressable
                key={p}
                style={[styles.periodButton, active && styles.periodButtonActive]}
                onPress={() => setActivePeriod(p)}
              >
                <Text style={[styles.periodText, active && styles.periodTextActive]}>
                  {p}
                </Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.calendarIcon}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.muted} />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Calories</Text>
          <Text style={styles.statValue}>{totalKcal} kCal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Workouts Done</Text>
          <Text style={styles.statValue}>
            {completedCount}
            {filtered.length > completedCount && (
              <Text style={styles.statSub}> / {filtered.length}</Text>
            )}
          </Text>
        </View>
      </View>

      <Pressable style={styles.plannerRow}>
        <Text style={styles.plannerTitle}>Weekly Planner</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
      </Pressable>

      <Text style={styles.sectionTitle}>Your progress</Text>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color={theme.colors.border} />
          <Text style={styles.emptyText}>No workouts recorded yet.</Text>
          <Text style={styles.emptySubtext}>
            Complete a workout and it'll show up here!
          </Text>
          <Pressable
            style={styles.startButton}
            onPress={() => router.push("/(tabs)/plan")}
          >
            <Text style={styles.startButtonText}>Start a Workout</Text>
          </Pressable>
        </View>
      ) : (
        filtered.map((entry) => {
          const { logId, workout, completedAt, exercisesDone, exercisesTotal, isFullyComplete } = entry;
          return (
            <Pressable
              key={logId}
              onPress={() => router.push(`/workout/${workout.id}`)}
              style={[styles.progressCard, !isFullyComplete && styles.progressCardPartial]}
            >
              <Image
                source={{ uri: workout.image_url }}
                style={styles.progressImage}
                resizeMode="cover"
              />
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>{workout.title}</Text>
                <View style={styles.progressTags}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{workout.duration_minutes} min</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{workout.level}</Text>
                  </View>
                  {exercisesTotal > 0 && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {exercisesDone}/{exercisesTotal} rounds
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.progressDate}>{formatDate(completedAt)}</Text>
              </View>
              {isFullyComplete ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>completed</Text>
                  <Ionicons name="checkmark" size={14} color="#059669" />
                </View>
              ) : (
                <View style={styles.incompleteBadge}>
                  <Text style={styles.incompleteText}>incomplete</Text>
                  <Ionicons name="ellipse" size={10} color="#d97706" />
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.screen, paddingTop: 52 },
  center: { justifyContent: "center", alignItems: "center" },
  header: { fontSize: theme.fontSize.title, fontWeight: "800", color: theme.colors.text, marginBottom: 16 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  monthTitle: { fontSize: theme.fontSize.section, fontWeight: "800", color: theme.colors.text },
  periodRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  periodButton: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border,
  },
  periodButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  periodText: { fontSize: 13, fontWeight: "600", color: theme.colors.muted },
  periodTextActive: { color: theme.colors.white },
  calendarIcon: { marginLeft: 4 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: theme.colors.white, borderRadius: theme.radius.card,
    padding: 16, borderWidth: 1, borderColor: theme.colors.border,
  },
  statLabel: { fontSize: theme.fontSize.subtitle, color: theme.colors.muted, marginBottom: 6 },
  statValue: { fontSize: theme.fontSize.section, fontWeight: "800", color: theme.colors.text },
  statSub: { fontSize: theme.fontSize.subtitle, fontWeight: "600", color: theme.colors.muted },
  plannerRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.radius.card,
    padding: 16, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12,
  },
  plannerTitle: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.text },
  sectionTitle: { fontSize: theme.fontSize.section, fontWeight: "800", color: theme.colors.text, marginBottom: 14, marginTop: 12 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.text, marginTop: 8 },
  emptySubtext: { fontSize: theme.fontSize.subtitle, color: theme.colors.muted, textAlign: "center" },
  startButton: {
    backgroundColor: theme.colors.button, borderRadius: theme.radius.button,
    paddingHorizontal: 24, paddingVertical: 14, marginTop: 12,
  },
  startButtonText: { color: theme.colors.white, fontWeight: "700", fontSize: theme.fontSize.card },
  progressCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: theme.colors.white, borderRadius: theme.radius.card,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border,
  },
  progressCardPartial: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  progressImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: theme.colors.border },
  progressInfo: { flex: 1, marginLeft: 12 },
  progressTitle: { fontSize: theme.fontSize.card, fontWeight: "700", color: theme.colors.text, marginBottom: 4 },
  progressTags: { flexDirection: "row", gap: 6, marginBottom: 4, flexWrap: "wrap" },
  tag: { backgroundColor: theme.colors.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 11, color: theme.colors.primary, fontWeight: "600" },
  progressDate: { fontSize: 11, color: theme.colors.muted },
  completedBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  completedText: { fontSize: 12, color: "#059669", fontWeight: "600" },
  incompleteBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  incompleteText: { fontSize: 12, color: "#d97706", fontWeight: "600" },
});