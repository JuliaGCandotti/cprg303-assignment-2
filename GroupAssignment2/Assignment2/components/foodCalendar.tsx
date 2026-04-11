import React, { useState, useCallback } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { StyleSheet } from "react-native";
import { theme } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import {
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoodLog {
  date: Date;
  url?: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

// ─── Data layer ───────────────────────────────────────────────────────────────

// In a real app this would come from a database / context / Zustand store.
// For now we keep it as module-level state so it survives re-renders.
let foodLogs: FoodLog[] = [
  {
    date: new Date(2026, 4, 2),
    url: "https://foodish-api.com/images/burger/burger23.jpg",
    description: "Grilled chicken with veggies",
    calories: 450,
    carbs: 30,
    protein: 40,
    fat: 15,
  },
  {
    date: new Date(2026, 3, 5),
    url: "https://foodish-api.com/images/burger/burger24.jpg",
    description: "Cheeseburger with fries",
    calories: 600,
    carbs: 50,
    protein: 30,
    fat: 35,
  },
  {
    date: new Date(2026, 4, 9),
    url: "https://foodish-api.com/images/burger/burger25.jpg",
    description: "Veggie burger with sweet potato fries",
    calories: 500,
    carbs: 45,
    protein: 25,
    fat: 20,
  },
  {
    date: new Date(2026, 4, 10),
    url: "https://foodish-api.com/images/burger/burger26.jpg",
    description: "Chicken burger with avocado",
    calories: 550,
    carbs: 40,
    protein: 35,
    fat: 25,
  },
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getFoodLog(date: Date): FoodLog | null {
  return foodLogs.find((log) => isSameDay(log.date, date)) ?? null;
}

function addFoodLog(log: FoodLog): void {
  // Replace existing log for same day, or append
  const idx = foodLogs.findIndex((l) => isSameDay(l.date, log.date));
  if (idx !== -1) {
    foodLogs[idx] = log;
  } else {
    foodLogs = [...foodLogs, log];
  }
}

// ─── AI food recognition ───────────────────────────────────────────────────────

interface AINutrition {
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

/**
 * Sends a base64 image to the Anthropic API and asks Claude to estimate
 * the nutritional content. Returns parsed macros or throws on failure.
 */
async function analyzeImageWithAI(base64: string): Promise<AINutrition> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64,
              },
            },
            {
              type: "text",
              text: `You are a nutrition expert. Look at this food image and estimate the nutritional content.
Respond ONLY with a JSON object — no markdown fences, no extra text.
Format:
{
  "description": "<short meal name>",
  "calories": <number>,
  "carbs": <number in grams>,
  "protein": <number in grams>,
  "fat": <number in grams>
}
Be reasonable. If you cannot see food clearly, make a best guess based on what is visible.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  const data = await response.json();
  const text: string =
    data?.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed: AINutrition = JSON.parse(clean);
  return parsed;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 32 - 6 * 4) / 7);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DayCell {
  day: number | null;
  date: Date | null;
  foodLog: FoodLog | null;
}

interface DayCellProps {
  cell: DayCell;
  isToday: boolean;
  onPress: () => void;
}

const DayCellView: React.FC<DayCellProps> = ({ cell, isToday, onPress }) => {
  if (!cell.day) {
    return <View style={[styles.dayCell, styles.emptyCell]} />;
  }

  const hasLog = cell.foodLog !== null;
  const logCalories = cell.foodLog?.calories ?? 0;
  const accentColor =
    logCalories > 500 ? theme.colors.error : theme.colors.primary;

  // Show today ring even without a log so the user always knows where "today" is
  const todayBorderColor = hasLog ? accentColor : theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        isToday && { borderColor: todayBorderColor, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Show day number only if there's no log, otherwise show the food photo as
      the main visual */}
      {!hasLog && (
        <Text
          style={[
            styles.dayNumText,
            isToday && { color: todayBorderColor, fontWeight: "700" },
          ]}
        >
          {cell.day}
        </Text>
      )}
      {hasLog && cell.foodLog && (
        <View style={styles.foodIndicator}>
          {cell.foodLog.url ? (
            <Image
              source={{ uri: cell.foodLog.url }}
              style={styles.foodImage}
            />
          ) : (
            // Fallback when no photo was taken — show a colour swatch
            <View
              style={[
                styles.foodImage,
                { backgroundColor: theme.colors.primary, opacity: 0.3 },
              ]}
            />
          )}
        </View>
      )}

      {/* <Text
        style={[
          styles.dayNumText,
          isToday && { color: todayBorderColor, fontWeight: "700" },
        ]}
      >
        {cell.day}
      </Text>
      {hasLog && cell.foodLog && (
        <View style={styles.foodIndicator}>
          {cell.foodLog.url ? (
            <Image
              source={{ uri: cell.foodLog.url }}
              style={styles.foodImage}
            />
          ) : (
            // Fallback when no photo was taken — show a colour swatch
            <View
              style={[
                styles.foodImage,
                { backgroundColor: theme.colors.primary, opacity: 0.3 },
              ]}
            />
          )}
        </View> */}
    </TouchableOpacity>
  );
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface FoodForm {
  name: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  note: string;
}

const emptyForm = (): FoodForm => ({
  name: "",
  calories: "",
  carbs: "",
  protein: "",
  fat: "",
  note: "",
});

// ─── Main component ───────────────────────────────────────────────────────────

function FoodCalendar() {
  const today = new Date(2026, 4, 10);
  const [current, setCurrent] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addFoodVisible, setAddFoodVisible] = useState(false);

  // Force re-render after saving a new log
  const [version, setVersion] = useState(0);

  // Form
  const [form, setForm] = useState<FoodForm>(emptyForm());
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();

  const cells: DayCell[] = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, date: null, foodLog: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ day: d, date, foodLog: getFoodLog(date) });
  }

  const handleDayPress = useCallback((cell: DayCell) => {
    if (!cell.date) return;
    if (!cell.foodLog) {
      // Open "add" sheet pre-set to that date
      setSelectedDate(cell.date);
      setAddFoodVisible(true);
      return;
    }
    setSelectedDate(cell.date);
    setModalVisible(true);
  }, []);

  const handlePrevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const selectedLog = selectedDate ? getFoodLog(selectedDate) : null;

  // ── Image picker ────────────────────────────────────────────────────────────

  const handleImagePick = () => {
    Alert.alert("Add Food Photo", "Choose an option", [
      { text: "Camera", onPress: () => openPicker("camera") },
      { text: "Gallery", onPress: () => openPicker("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openPicker = async (type: "camera" | "library") => {
    try {
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Camera access is required.");
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Gallery access is required.");
          return;
        }
      }

      const result =
        type === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: "images",
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            });

      if (!result.canceled) {
        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        setPhotoBase64(asset.base64 ?? null);
        setAiError(null);

        // Automatically kick off AI analysis if we have base64 data
        if (asset.base64) {
          await runAIAnalysis(asset.base64);
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while picking the image.");
      console.error("ImagePicker Error:", error);
    }
  };

  // ── AI analysis ─────────────────────────────────────────────────────────────

  const runAIAnalysis = async (base64: string) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const nutrition = await analyzeImageWithAI(base64);
      setForm({
        name: nutrition.description,
        calories: String(nutrition.calories),
        carbs: String(nutrition.carbs),
        protein: String(nutrition.protein),
        fat: String(nutrition.fat),
        note: "",
      });
    } catch (err) {
      console.error("AI analysis error:", err);
      setAiError("Could not analyse image. Please fill in manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRetryAI = async () => {
    if (photoBase64) {
      await runAIAnalysis(photoBase64);
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    const date = selectedDate ?? today;
    const calories = parseInt(form.calories, 10);
    const carbs = parseInt(form.carbs, 10);
    const protein = parseInt(form.protein, 10);
    const fat = parseInt(form.fat, 10);

    if (!form.name.trim()) {
      Alert.alert("Missing info", "Please enter a food name.");
      return;
    }
    if (isNaN(calories)) {
      Alert.alert("Missing info", "Please enter calories.");
      return;
    }

    addFoodLog({
      date,
      url: photoUri ?? undefined,
      description: form.name.trim(),
      calories: isNaN(calories) ? 0 : calories,
      carbs: isNaN(carbs) ? 0 : carbs,
      protein: isNaN(protein) ? 0 : protein,
      fat: isNaN(fat) ? 0 : fat,
    });

    closeAddSheet();
    setVersion((v) => v + 1); // trigger re-render
  };

  const closeAddSheet = () => {
    setAddFoodVisible(false);
    setPhotoUri(null);
    setPhotoBase64(null);
    setAiError(null);
    setAiLoading(false);
    setForm(emptyForm());
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>Food Diary</Text>
            <Text style={styles.appSubtitle}>Food Intake</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>12 day streak</Text>
          </View>
        </View>

        {/* Month nav */}
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {MONTHS[month]} {year}
          </Text>
          <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth}>
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((d, i) => (
            <Text key={i} style={styles.weekdayLabel}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar grid — key on version so new logs appear immediately */}
        <View style={styles.grid} key={version}>
          {cells.map((cell, i) => (
            <DayCellView
              key={i}
              cell={cell}
              isToday={cell.date?.toDateString() === today.toDateString()}
              onPress={() => handleDayPress(cell)}
            />
          ))}
        </View>

        <View style={{ height: 24 }} />

        <Pressable
          style={[styles.foodBtn, { width: "80%", alignSelf: "center" }]}
          onPress={() => {
            setSelectedDate(today);
            setAddFoodVisible(true);
          }}
        >
          <Text style={styles.foodBtnText}>+ Add Food</Text>
        </Pressable>
      </ScrollView>

      {/* ── Add food modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={addFoodVisible}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={closeAddSheet}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.addFoodHeader}>
              <Pressable style={styles.foodBtn} onPress={closeAddSheet}>
                <Text style={styles.foodBtnText}>Cancel</Text>
              </Pressable>
              <Text style={styles.sheetDate}>Add Food</Text>
              <Pressable style={styles.foodBtn} onPress={handleSave}>
                <Text style={styles.foodBtnText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.formField}
              keyboardShouldPersistTaps="handled"
            >
              {/* Photo preview */}
              {photoUri && (
                <View
                  style={[
                    styles.foodIndicator,
                    { width: 80, height: 80, marginBottom: 8 },
                  ]}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.foodImage}
                    onError={() => setPhotoUri(null)}
                  />
                  <Pressable
                    style={styles.removePhotoBtn}
                    onPress={() => {
                      setPhotoUri(null);
                      setPhotoBase64(null);
                    }}
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </Pressable>
                </View>
              )}

              {/* Photo button */}
              <Pressable
                style={[
                  styles.foodBtn,
                  {
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    alignSelf: "flex-start",
                    marginBottom: 16,
                  },
                ]}
                onPress={handleImagePick}
              >
                <Text style={styles.foodBtnText}>
                  {photoUri ? "Change Photo" : "+ Add Photo"}
                </Text>
              </Pressable>

              {/* AI status */}
              {aiLoading && (
                <View style={styles.aiRow}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.aiText}>Analysing with AI…</Text>
                </View>
              )}
              {aiError && (
                <View style={styles.aiRow}>
                  <Text
                    style={[
                      styles.aiText,
                      { color: theme.colors.error, flex: 1 },
                    ]}
                  >
                    {aiError}
                  </Text>
                  <Pressable onPress={handleRetryAI}>
                    <Text
                      style={[styles.aiText, { color: theme.colors.primary }]}
                    >
                      Retry
                    </Text>
                  </Pressable>
                </View>
              )}
              {photoUri && !aiLoading && !aiError && form.name !== "" && (
                <Text
                  style={[
                    styles.aiText,
                    { color: theme.colors.primary, marginBottom: 8 },
                  ]}
                >
                  ✓ AI filled in the details — review and adjust if needed.
                </Text>
              )}

              {/* Form fields */}
              <Text style={styles.fieldLabel}>Food name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Grilled salmon with rice"
                placeholderTextColor={theme.colors.muted}
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              />

              <Text style={styles.fieldLabel}>Calories (kcal)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 450"
                placeholderTextColor={theme.colors.muted}
                keyboardType="numeric"
                value={form.calories}
                onChangeText={(v) => setForm((f) => ({ ...f, calories: v }))}
              />

              <View style={styles.macroRow}>
                <View style={styles.macroField}>
                  <Text style={styles.fieldLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={theme.colors.muted}
                    keyboardType="numeric"
                    value={form.carbs}
                    onChangeText={(v) => setForm((f) => ({ ...f, carbs: v }))}
                  />
                </View>
                <View style={styles.macroField}>
                  <Text style={styles.fieldLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={theme.colors.muted}
                    keyboardType="numeric"
                    value={form.protein}
                    onChangeText={(v) => setForm((f) => ({ ...f, protein: v }))}
                  />
                </View>
                <View style={styles.macroField}>
                  <Text style={styles.fieldLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={theme.colors.muted}
                    keyboardType="numeric"
                    value={form.fat}
                    onChangeText={(v) => setForm((f) => ({ ...f, fat: v }))}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput
                style={[styles.input, { minHeight: 64 }]}
                placeholder="Any extra notes…"
                placeholderTextColor={theme.colors.muted}
                multiline
                value={form.note}
                onChangeText={(v) => setForm((f) => ({ ...f, note: v }))}
              />

              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Detail modal ───────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            {selectedDate && selectedLog && (
              <>
                <View style={styles.sheetHeader}>
                  <View
                    style={[
                      styles.workoutBadge,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text style={styles.workoutBadgeText}>🍽️ FOOD</Text>
                  </View>
                  <Text style={styles.sheetDate}>
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    {selectedLog.description}
                  </Text>
                </View>

                {selectedLog.url && (
                  <View style={styles.sheetContent}>
                    <Image
                      source={{ uri: selectedLog.url }}
                      style={styles.sheetImage}
                    />
                  </View>
                )}

                <View style={styles.exerciseList}>
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

                <TouchableOpacity
                  style={[
                    styles.closeBtn,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Tiny helper component ────────────────────────────────────────────────────

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
  <View style={styles.exerciseRow}>
    <View style={[styles.exerciseIconWrap, { backgroundColor: bg }]}>
      <Text style={styles.exerciseIcon}>{icon}</Text>
    </View>
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseName}>{label}</Text>
      <Text style={styles.exerciseDetail}>{value}</Text>
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAFAFA" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  appSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 1 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  streakIcon: { fontSize: 14 },
  streakText: { fontSize: 13, fontWeight: "600", color: "#92400E" },

  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  navBtnText: { fontSize: 20, color: "#374151", lineHeight: 24 },
  monthLabel: { fontSize: 17, fontWeight: "600", color: "#111827" },

  weekdayRow: { flexDirection: "row", marginBottom: 8 },
  weekdayLabel: {
    width: DAY_SIZE,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    marginHorizontal: 2,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 8,
    justifyContent: "space-between",
  },
  emptyCell: { backgroundColor: "transparent", borderWidth: 0 },
  dayNumText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  foodIndicator: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  foodImage: { width: "100%", height: "100%", resizeMode: "cover" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
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
  sheetHeader: { padding: 20, paddingTop: 16 },
  workoutBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  workoutBadgeText: {
    color: "#FFFFFF",
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

  exerciseList: { paddingHorizontal: 20, marginTop: 4 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  exerciseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseIcon: { fontSize: 20 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  exerciseDetail: { fontSize: 13, color: "#6B7280", marginTop: 1 },

  closeBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  closeBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  foodBtn: {
    backgroundColor: theme.colors.button,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.button,
    alignItems: "center",
  },
  foodBtnText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.card,
    fontWeight: "600",
    textAlign: "center",
  },

  addFoodHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  formField: { paddingHorizontal: 20, paddingTop: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    padding: 12,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  },
  macroRow: { flexDirection: "row", gap: 8 },
  macroField: { flex: 1 },

  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  aiText: { fontSize: 13, color: "#6B7280" },

  removePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  sheetContent: {
    borderRadius: theme.radius.card,
    borderWidth: 1,
    marginHorizontal: 20,
    width: DAY_SIZE * 1.5,
    height: DAY_SIZE * 1.5,
    alignSelf: "center",
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  sheetImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.card,
    resizeMode: "cover",
  },
});

export default FoodCalendar;
