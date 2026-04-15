import { Modal } from "react-native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { theme } from "@/styles/theme";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { StyleSheet, Dimensions } from "react-native";
import { FoodLog } from "@/data/foodlogs";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 32 - 6 * 4) / 7);

const MacroRow = ({
  icon,
  bg,
  label,
  value,
}: {
  icon: string;
  bg: string;
  label: string;
  value: string;
}) => (
  <View style={styles.nutritionRow}>
    <View style={[styles.nutritionIconWrap, { backgroundColor: bg }]}>
      <Text style={styles.nutritionIcon}>{icon}</Text>
    </View>
    <View style={styles.nutritionInfo}>
      <Text style={styles.nutritionName}>{label}</Text>
      <Text style={styles.nutritionDetail}>{value}</Text>
    </View>
  </View>
);
export default function FoodDetailModal({
  visible,
  onClose,
  selectedDate,
  selectedLog,
}: {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedLog: FoodLog | null;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          {selectedDate && selectedLog && (
            <>
              <View style={styles.sheetHeader}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View
                    style={[
                      styles.foodBadge,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text style={styles.foodBadgeText}>🍽️ FOOD</Text>
                  </View>

                  <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close" size={18} color="#ffffffff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sheetDate}>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.sheetSubtitle}>{selectedLog.title}</Text>
              </View>

              {selectedLog.imageUrl && (
                <View style={styles.sheetContent}>
                  <Image
                    source={selectedLog.imageUrl}
                    style={styles.sheetImage}
                  />
                </View>
              )}

              <View style={styles.nutritionList}>
                <MacroRow
                  icon="🔥"
                  bg="#FEF3C7"
                  label="Calories"
                  value={`${selectedLog.calories} kcal`}
                />
                <MacroRow
                  icon="🥗"
                  bg="#DBEAFE"
                  label="Carbs"
                  value={`${selectedLog.carbs}g`}
                />
                <MacroRow
                  icon="🍗"
                  bg="#DCFCE7"
                  label="Protein"
                  value={`${selectedLog.protein}g`}
                />
                <MacroRow
                  icon="🫒"
                  bg="#FCE7F3"
                  label="Fat"
                  value={`${selectedLog.fat}g`}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    padding: 20,
    paddingTop: 16,
  },
  foodBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  foodBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  sheetDate: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  sheetSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  nutritionList: { paddingHorizontal: 20, marginTop: 4 },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  nutritionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionIcon: { fontSize: 20 },
  nutritionInfo: { flex: 1 },
  nutritionName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  nutritionDetail: { fontSize: 13, color: "#6B7280", marginTop: 1 },

  sheetContent: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    marginHorizontal: 20,
    width: DAY_SIZE * 3.0,
    height: DAY_SIZE * 3.0,
    alignSelf: "center",
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  sheetImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.card,
    resizeMode: "cover",
  },
  closeBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    translateY: -1,
  },
});
