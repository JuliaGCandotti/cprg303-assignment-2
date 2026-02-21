import react from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { theme } from "../styles/theme";

export default function ProgressCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Workout</Text>
      <Text style={styles.subtitle}>
        You completed 3 workouts this week. Keep it up!
      </Text>
      <Pressable>
        <Text style={styles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.gap,
    marginBottom: theme.spacing.gap,
  },
  title: {
    fontSize: theme.fontSize.section,
    color: theme.colors.text,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
  },
  buttonText: {
    color: theme.colors.muted,
  },
});
