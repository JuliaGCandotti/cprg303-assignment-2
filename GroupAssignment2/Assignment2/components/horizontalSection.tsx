import React from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function HorizontalSection({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable>
          <Text style={styles.viewAll}>View all &gt;</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.gap,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
  },
  scroll: {
    gap: theme.spacing.gap,
  },
});
