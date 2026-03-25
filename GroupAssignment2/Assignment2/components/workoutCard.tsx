import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type Props = {
  id: string;
  image?: any;
  title: string;
  durationMinutes: number;
  exercises: { id: string }[];
  level: string;
  kcal: number;
  description: string;
};

export default function WorkoutCard({
  id,
  image,
  title,
  durationMinutes,
  exercises,
  level,
  kcal,
  description,
}: Props) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/workout/[id]", params: { id } })
      }
    >
      <View style={styles.container}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {durationMinutes} min · {exercises.length} exercises
          </Text>
          <Text style={styles.level}>{level}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    marginBottom: theme.spacing.gap,
    padding: theme.spacing.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.card,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
  },
  level: {
    marginTop: 4,
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
