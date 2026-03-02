import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from "react-native";
import { theme } from "@/styles/theme";
import WorkoutCard from "@/components/workoutCard";
import HorizontalSection from "@/components/horizontalSection";

const WORKOUTS = [
  {
    id: "1",
    title: "Quick Arms & Upper Body Pilates",
    duration: 6,
    numberOfExercises: 8,
    level: "Beginner",
    kcal: "61.4",
    description: "Want to sculpt your arms? Kickstart your fitness revolution with this Pilates flow and achieve a well-toned upper body that sets you apart!\n\nBy engaging the muscles in your arms, shoulders, and upper back, you'll attain elegantly sculpted and finely defined arms you've been dreaming of!",
    image: { uri: "https://img.freepik.com/free-photo/fitness-girl-lifting-dumbbell_1163-1847.jpg" },
  },
  {
    id: "2",
    title: "Yoga for Anxiety & Stress Relief",
    duration: 17,
    numberOfExercises: 22,
    level: "Beginner",
    kcal: "117.9",
    description: "De-stress with this calming yoga routine. This practice is tailored to soothe your nervous system, calm your mind, and help you find inner peace.\n\nEach pose will lead you through mindful movements, bringing more balance and peace within your mind. This is your inner work!",
    image: { uri: "https://img.freepik.com/free-photo/young-woman-doing-anjaneyasana-exercise_1163-5040.jpg" },
  },
];

const CHALLENGES = [
  { id: "1", label: "28-DAY", title: "STRETCHING", users: "19K", image: { uri: "https://img.freepik.com/free-photo/cheerful-fitness-woman-making-yoga-exercise_171337-7751.jpg" } },
  { id: "2", label: "28-DAY", title: "FLAT ABS", users: "21K", image: { uri: "https://img.freepik.com/free-photo/side-view-determined-young-woman-holding-slam-ball-with-her-legs-doing-abdominal-crunches-have-flat-abs_662251-1367.jpg" } },
  { id: "3", label: "28-DAY", title: "STRENGTH", users: "16K", image: { uri: "https://img.freepik.com/free-photo/crossfit-athlete-doing-exercise-with-barbell_58466-11670.jpg" } },
  { id: "4", label: "28-DAY", title: "POWER LEGS", users: "12K", image: { uri: "https://img.freepik.com/free-photo/fitness-woman-doing-stretching-exercises_171337-13281.jpg" } },
];

export default function PlanScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Pilates Primer</Text>

      {/* DAY 1 Card */}
      <View style={styles.dayCard}>
        <Image
          source={{ uri: "https://img.freepik.com/free-photo/sport-is-my-life-unshaven-man-has-workout-gym_273609-29961.jpg" }}
          style={styles.dayImage}
          resizeMode="cover"
        />
        <View style={styles.dayOverlay}>
          <Text style={styles.dayTitle}>DAY 1</Text>
          <Text style={styles.daySubtitle}>6 Min | 7 Exercises</Text>
          <Pressable style={styles.startButton}>
            <Text style={styles.startText}>Start →</Text>
          </Pressable>
        </View>
      </View>

      {/* Challenges */}
      <HorizontalSection title="Challenges">
        {CHALLENGES.map((challenge) => (
          <View key={challenge.id} style={styles.challengeCard}>
            <Image source={challenge.image} style={styles.challengeImage} resizeMode="cover" />
            <View style={styles.challengeContent}>
              <Text style={styles.challengeLabel}>{challenge.label}</Text>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeUsers}>{challenge.users} users joined</Text>
              <Pressable style={styles.joinButton}>
                <Text style={styles.joinText}>Join</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </HorizontalSection>

      {/* Just for you */}
      <Text style={styles.sectionTitle}>Just for you</Text>
      <Text style={styles.sectionSubtitle}>Tailored to your goals & preferences!</Text>
      {WORKOUTS.map((workout) => (
        <WorkoutCard
          id={workout.id}
          key={workout.id}
          title={workout.title}
          duration={workout.duration}
          numberOfExercises={workout.numberOfExercises}
          level={workout.level}
          kcal={workout.kcal}
          description={workout.description}
          image={workout.image}
        />
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
    marginBottom: 16,
  },
  dayCard: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
    marginBottom: 24,
    height: 200,
  },
  dayImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dayOverlay: {
    flex: 1,
    backgroundColor: "rgba(124, 111, 247, 0.55)",
    padding: theme.spacing.card,
    justifyContent: "space-between",
  },
  dayTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: theme.colors.white,
  },
  daySubtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.white,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.button,
    padding: 14,
    alignItems: "center",
  },
  startText: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
  challengeCard: {
    width: 180,
    borderRadius: theme.radius.card,
    overflow: "hidden",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  challengeImage: {
    width: "100%",
    height: 100,
  },
  challengeContent: {
    padding: theme.spacing.card,
  },
  challengeLabel: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  challengeTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },
  challengeUsers: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.button,
    padding: 10,
    alignItems: "center",
  },
  joinText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    marginBottom: 16,
  },
});