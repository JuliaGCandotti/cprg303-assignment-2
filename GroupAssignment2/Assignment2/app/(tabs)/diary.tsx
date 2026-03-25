import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// TODO: implement Diary screen
export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diary</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
    marginTop: 8,
  },
});
