import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FoodLog, initialFoodLogs } from "@/data/foodlogs";
import HorizontalSection from "@/components/horizontalSection";
import FoodCard from "@/components/foodCard";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FoodDetailPage() {
  const router = useRouter();
  const { dateString } = useLocalSearchParams();

  // Parse the date from route params
  const selectedDate = dateString ? new Date(dateString as string) : new Date();

  // Filter food logs for the selected date
  const dayFoodLogs = useMemo(() => {
    return initialFoodLogs.filter((log: FoodLog) => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === selectedDate.toDateString();
    });
  }, [selectedDate]);

  // Calculate total macros for the day
  const totalMacros = useMemo(() => {
    return dayFoodLogs.reduce<{
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
    }>(
      (acc, log: FoodLog) => ({
        calories: acc.calories + (log.calories || 0),
        carbs: acc.carbs + (log.carbs || 0),
        protein: acc.protein + (log.protein || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
  }, [dayFoodLogs]);

  const MacroCard = ({
    icon,
    bg,
    label,
    value,
    unit,
  }: {
    icon: string;
    bg: string;
    label: string;
    value: number;
    unit: string;
  }) => (
    <View style={[styles.macroCard, { backgroundColor: bg }]}>
      <Text style={styles.macroIcon}>{icon}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>
        {value}
        {unit}
      </Text>
    </View>
  );
  const FoodImageItem = ({ item }: { item: FoodLog }) => (
    <TouchableOpacity style={styles.foodImageCard} activeOpacity={0.8}>
      {item.imageUrl && (
        <Image
          source={
            typeof item.imageUrl === "string"
              ? { uri: item.imageUrl }
              : item.imageUrl
          }
          style={styles.foodImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.foodImageOverlay}>
        <Text style={styles.foodImageLabel} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.foodImageCalories}>{item.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.dateHeader}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.logCount}>
            {dayFoodLogs.length} {dayFoodLogs.length === 1 ? "item" : "items"}
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dayFoodLogs.length > 0 ? (
          <>
            {/* Horizontal scroll of food images */}
            <View style={styles.section}>
              <HorizontalSection
                title="Today's Meals"
                showSeeAll={false}
                onSeeAll={() => {}}
              >
                {dayFoodLogs.map((item) => (
                  <FoodImageItem key={item.id} item={item} />
                ))}
              </HorizontalSection>
            </View>

            {/* Total Nutrition Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Nutrition</Text>
              <View style={styles.macroGrid}>
                <MacroCard
                  icon="🔥"
                  bg="#FEF3C7"
                  label="Calories"
                  value={totalMacros.calories}
                  unit=" kcal"
                />
                <MacroCard
                  icon="🥗"
                  bg="#DBEAFE"
                  label="Carbs"
                  value={totalMacros.carbs}
                  unit="g"
                />
                <MacroCard
                  icon="🍗"
                  bg="#DCFCE7"
                  label="Protein"
                  value={totalMacros.protein}
                  unit="g"
                />
                <MacroCard
                  icon="🫒"
                  bg="#FCE7F3"
                  label="Fat"
                  value={totalMacros.fat}
                  unit="g"
                />
              </View>
            </View>

            {/* Meal List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Details</Text>
              <View style={styles.mealList}>
                {dayFoodLogs.map((log) => (
                  <FoodCard
                    key={log.id}
                    title={log.title}
                    image_url={log.imageUrl}
                    calories={log.calories}
                  />
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>No meals logged</Text>
            <Text style={styles.emptySubtext}>
              Add your first meal to track nutrition
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={theme.colors.white}
              />
              <Text style={styles.addButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    alignItems: "center",
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  logCount: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 12,
  },
  foodImageList: {
    gap: 12,
    paddingRight: 16,
  },
  foodImageCard: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
  },
  foodImageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.white,
  },
  foodImageCalories: {
    fontSize: 11,
    color: "#FEF3C7",
    marginTop: 2,
  },
  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  macroCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  macroIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  mealList: {
    flexDirection: "column",
    gap: theme.spacing.gap,
  },
});
