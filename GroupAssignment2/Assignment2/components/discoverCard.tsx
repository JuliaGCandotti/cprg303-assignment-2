import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Program = {
  id: string;
  title: string;
  durationMinutes: number;
  level: string;
  image: any;
};

type Props = {
  program: Program;
  width?: number | string; // NEW
};

export default function DiscoverCard({ program, width = "48%" }: Props) {
  return (
    <Pressable
      style={[styles.card, { width: width as any }]}
      onPress={() =>
        router.push({ pathname: "/workout/[id]", params: { id: program.id } })
      }
    >
      <View style={styles.imageWrapper}>
        <Image source={program.image} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {program.title}
      </Text>
      <Text style={styles.subtitle}>
        {program.level} · {program.durationMinutes} min
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.colors.border,
  },
  image: { width: "100%", height: "100%" },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
});