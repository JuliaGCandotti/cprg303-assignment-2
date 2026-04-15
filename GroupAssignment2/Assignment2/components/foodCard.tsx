import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

type FoodCardProps = {
  title: string;
  image_url?: string | { uri: string };
  calories: number;
};

export default function FoodCard({
  title,
  image_url,
  calories,
}: FoodCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={typeof image_url === "string" ? { uri: image_url } : image_url}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.calories}>{calories} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    // marginBottom: theme.spacing.gap,
    shadowColor: "#000",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.card,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  calories: {
    fontSize: theme.fontSize.card,
    color: theme.colors.muted,
  },
});
