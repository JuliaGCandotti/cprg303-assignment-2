import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};
export default function VerticalSection({ title, subtitle, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.gap,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.gap,
  },
  title: {
    fontSize: theme.fontSize.section,
    color: theme.colors.text,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
  },
});
