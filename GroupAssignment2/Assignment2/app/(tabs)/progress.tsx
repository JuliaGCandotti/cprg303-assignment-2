import { theme } from "@/styles/theme";
import { WORKOUTS } from "@/data/workouts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CompletedEntry = {
  id: string;
  title: string;
  completedAt: string;
};

const PERIOD_LABELS = ["W", "M", "Year"];

export default function ProgressScreen() {
  const [completed, setCompleted] = useState<CompletedEntry[]>([]);
  const [activePeriod, setActivePeriod] = useState("M");

  // Reload every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompleted();
    }, [])
  );

  const loadCompleted = async () => {
    try {
      const raw = await AsyncStorage.getItem("completedWorkouts");
      const list: CompletedEntry[] = raw ? JSON.parse(raw) : [];
      setCompleted(list);
    } catch {
      setCompleted([]);
    }
  };

  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  // Filter by period
  const filtered = completed.filter((entry) => {
    const date = new Date(entry.completedAt);
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
    // Year
    return date.getFullYear() === now.getFullYear();
  });

  const totalKcal = filtered.reduce((sum, entry) => {
    const workout = WORKOUTS.find((w) => w.id === entry.id);
    return sum + (workout?.kcal ?? 0);
  }, 0);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.header}>Progress</Text>

      {/* Month + period picker */}
      <View style={styles.topRow}>
        <Text style={styles.monthTitle}>
          {monthName} {year}
        </Text>
        <View style={styles.periodRow}>
          {PERIOD_LABELS.map((p) => (
            <Pressable
              key={p}
              style={[
                styles.periodButton,
                activePeriod === p && styles.periodButtonActive,
              ]}
              onPress={() => setActivePeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === p && styles.periodTextActive,
                ]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.calendarIcon}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.muted}
            />
          </Pressable>
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Calories</Text>
          <Text style={styles.statValue}>{totalKcal}kCal</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Workouts Done</Text>
          <Text style={styles.statValue}>{filtered.length}</Text>
        </View>
      </View>

      {/* Weekly Planner row */}
      <Pressable style={styles.plannerRow}>
        <Text style={styles.plannerTitle}>Weekly Planner</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.muted}
        />
      </Pressable>

      {/* Your Progress */}
      <Text style={styles.sectionTitle}>Your progress</Text>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="barbell-outline"
            size={48}
            color={theme.colors.border}
          />
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
        filtered.map((entry, index) => {
          const workout = WORKOUTS.find((w) => w.id === entry.id);
          return (
            <View key={`${entry.id}-${index}`} style={styles.progressCard}>
              <Image
                source={workout?.image ?? { uri: "" }}
                style={styles.progressImage}
                resizeMode="cover"
              />
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>{entry.title}</Text>
                {workout && (
                  <View style={styles.progressTags}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {workout.durationMinutes} min
                      </Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{workout.level}</Text>
                    </View>
                  </View>
                )}
                <Text style={styles.progressDate}>
                  {formatDate(entry.completedAt)}
                </Text>
              </View>
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>completed</Text>
                <Ionicons name="checkmark" size={14} color="#059669" />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.screen,
    paddingTop: 52,
  },
  header: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  periodTextActive: {
    color: theme.colors.white,
  },
  calendarIcon: {
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginBottom: 6,
  },
  statValue: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
  },
  plannerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  plannerTitle: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
  todayCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  todayText: {
    fontSize: theme.fontSize.card,
    color: theme.colors.text,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: theme.colors.button,
    borderRadius: theme.radius.button,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 12,
  },
  startButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: theme.fontSize.card,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  progressImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
  },
  progressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  progressTitle: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  progressTags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  progressDate: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
});
