import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Program = {
  id: string;
  title: string;
  duration: string;
  numberOfExercises: string;
  level: string;
  kcal: string;
  description: string;
  category: string;
  image: any;
};

export default function DiscoverCard({ program }: { program: Program }) {
  const handlePress = () => {
    router.push({
    pathname: "/programDescription/[details]",
    params: {
      details: program.id, 
      title: program.title,
      duration: program.duration,
      numberOfExercises: program.numberOfExercises,
      level: program.level,
      kcal: program.kcal,
      description: program.description,
      },
    });
  };

    return (
    <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.imageWrapper}>
        <Image source={program.image} style={styles.image} resizeMode="cover" />
        </View>
        <Text style={styles.title} numberOfLines={2}>
        {program.title}
        </Text>
        <Text style={styles.subtitle}>
        {program.level} · {program.duration} min
        </Text>
    </Pressable>
    );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 16,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.colors.border,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as any
    },

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