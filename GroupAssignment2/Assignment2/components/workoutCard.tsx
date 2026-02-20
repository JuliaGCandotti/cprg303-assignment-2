import React from "react";
import { theme } from "../styles/theme";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { router } from "expo-router";

type Props = {
  id: string;
  image?: any;
  title: string;
  duration: number;
  numberOfExercises: number;
  level: string;
  kcal: string;
  description: string;
};

export default function WorkoutCard({
  id,
  image,
  title,
  duration,
  numberOfExercises,
  level,
  kcal,
  description,
}: Props) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/programDescription/[details]",
          params: {
            details: id,
            title,
            duration,
            numberOfExercises,
            level,
            kcal,
            description,
          },
        })
      }
    >
      <View style={styles.container}>
        <Image source={image} style={styles.image} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {duration} min · {numberOfExercises} exercises
          </Text>
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
});
