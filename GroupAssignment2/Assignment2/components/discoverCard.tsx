import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  width?: number;
  program: {
    id: string;
    title: string;
    durationMinutes: number;
    level: string;
    image: ImageSourcePropType | { uri: string };
  };
  variant?: "horizontal" | "grid";
};

export default function DiscoverCard({
  width = 200,
  program,
  variant = "horizontal",
}: Props) {
  const router = useRouter();
  const isGrid = variant === "grid";

  return (
    <Pressable
      onPress={() => router.push(`/workout/${program.id}`)}
      style={[styles.card, isGrid ? styles.gridCard : { width }]}
    >
      <Image
        source={program.image}
        style={[styles.image, isGrid && styles.gridImage]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {program.title}
        </Text>
        <View style={styles.meta}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{program.level}</Text>
          </View>
          <Text style={styles.duration}>· {program.durationMinutes} min</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    overflow: "hidden",
  },
  gridCard: {
    flex: 1,
    minWidth: 0,
  },
  image: {
    width: "100%",
    height: 130,
  },
  gridImage: {
    height: 160,
    borderRadius: theme.radius.card,
  },
  info: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: theme.fontSize.card,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.badge,
  },
  badgeText: {
    fontSize: theme.fontSize.badge,
    color: theme.colors.primary,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  duration: {
    fontSize: theme.fontSize.badge,
    color: theme.colors.muted,
    fontWeight: "500",
  },
});
