import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/styles/theme";

export default function ProgramDetails() {
  const { title, duration, numberOfExercises, level, kcal, description } =
  useLocalSearchParams<{
    title: string;
    duration: string;
    numberOfExercises: string;
    level: string;
    kcal: string;
    description: string;
  }>();

  return (
    <ScrollView style={styles.container}>

      {/* Image placeholder with back and like buttons */}
      <View style={styles.imagePlaceholder}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.white} />
        </Pressable>
        <Pressable style={styles.likeButton}>
          <Ionicons name="heart-outline" size={22} color={theme.colors.white} />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{kcal}</Text>
            <Text style={styles.statLabel}>Kcal</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{duration} min</Text>
            <Text style={styles.statLabel}>Net Duration</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>

        {/* Workout settings */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Workout settings</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </View>

        {/* Exercises */}
        <Text style={styles.exercises}>Exercises ({numberOfExercises})</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: theme.colors.border,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  likeButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: theme.spacing.screen,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stat: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: theme.fontSize.card,
    fontWeight: "800",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginTop: 2,
  },
  description: {
    fontSize: theme.fontSize.card,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  rowText: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
  exercises: {
    fontSize: theme.fontSize.card,
    fontWeight: "800",
    color: theme.colors.text,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
});