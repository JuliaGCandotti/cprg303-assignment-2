import React from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { theme } from "@/styles/theme";
import * as ImagePicker from "expo-image-picker";
import { analyzeImageWithAI } from "@/lib/helper";
import { FoodLog } from "@/data/foodlogs";

export default function AddFoodModal({
  visible,
  onClose,
  date: selectedDate,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  date: Date | null;
  onSave: (log: FoodLog) => void;
}) {
  const [form, setForm] = React.useState({
    title: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    note: "",
    imgUrl: "",
  });
  const [photoUri, setPhotoUri] = React.useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  const initialForm = {
    title: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    note: "",
    imgUrl: "",
  };

  // ── Image picker and AI analysis logic ───────────────────────────────────────────────────────
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
  const runAIAnalysis = async (base64: string) => {
    setAiLoading(true);
    setAiError(null);

    try {
      const nutrition = await analyzeImageWithAI(base64);
      setForm({
        title: nutrition.title,
        calories: String(nutrition.calories),
        carbs: String(nutrition.carbs),
        protein: String(nutrition.protein),
        fat: String(nutrition.fat),
        note: "",
        imgUrl: nutrition.imgUrl,
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

  function handleSave() {
    const date = selectedDate || new Date();
    const newFoodLog: FoodLog = {
      id: Math.random().toString(36).substr(2, 9), // simple random ID generator
      title: form.title || "Untitled Food",
      calories: parseInt(form.calories) || 0,
      carbs: parseInt(form.carbs) || 0,
      protein: parseInt(form.protein) || 0,
      fat: parseInt(form.fat) || 0,
      imageUrl: { uri: photoUri || "" },
      date: date,
      note: form.note,
    };
    if (!form.title.trim()) {
      Alert.alert("Missing info", "Please enter a food title.");
      return;
    }
    if (isNaN(newFoodLog.calories) || newFoodLog.calories <= 0) {
      Alert.alert("Missing info", "Please enter calories.");
      return;
    }
    console.log("Saving new food log:", newFoodLog);
    onSave(newFoodLog);
    setForm(initialForm);
    handleClose();
  }
  function handleClose() {
    setForm(initialForm);
    setPhotoUri(null);
    setPhotoBase64(null);
    setAiError(null);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.addFoodHeader}>
            <Pressable style={styles.foodBtn} onPress={onClose}>
              <Text style={styles.foodBtnText}>Cancel</Text>
            </Pressable>
            <Text style={styles.sheetDate}>Add Food</Text>
            <Pressable style={styles.foodBtn} onPress={handleSave}>
              <Text style={styles.foodBtnText}>Save</Text>
            </Pressable>
          </View>

          {/* Form fields in a scroll view so keyboard doesn't cover them */}

          <ScrollView
            style={styles.formField}
            // contentContainerStyle={styles.formField}
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
                <ActivityIndicator size="small" color={theme.colors.primary} />
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
            {photoUri && !aiLoading && !aiError && form.title !== "" && (
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
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
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

  foodBtn: {
    backgroundColor: theme.colors.primary,
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
    borderBottomColor: theme.colors.border,
  },

  formField: { paddingHorizontal: 20, paddingTop: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
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
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // maxHeight: "90%",
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
  foodIndicator: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  foodImage: { width: "100%", height: "100%", resizeMode: "cover" },
});
