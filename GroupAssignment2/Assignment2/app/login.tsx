import { supabase } from "@/lib/supabase";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Mode = "signin" | "signup";

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit() {
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        Alert.alert(
          "Check your email",
          "We sent you a confirmation link. Verify your email to sign in.",
        );
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.replace("/(tabs)/plan");
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brandWrap}>
          <View style={styles.logo}>
            <Ionicons name="fitness" size={36} color={theme.colors.white} />
          </View>
          <Text style={styles.brand}>FitMate</Text>
          <Text style={styles.tagline}>
            {isSignup
              ? "Create an account to start your journey"
              : "Welcome back, let's keep going"}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>
            {isSignup ? "Sign up" : "Sign in"}
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={theme.colors.muted}
              style={styles.inputIcon}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={theme.colors.muted}
              style={styles.inputIcon}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.colors.muted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType={isSignup ? "newPassword" : "password"}
              style={styles.input}
              editable={!loading}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={10}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.colors.muted}
              />
            </Pressable>
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={16}
                color={theme.colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn,
              (loading || pressed) && { opacity: 0.85 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.submitText}>
                {isSignup ? "Create account" : "Sign in"}
              </Text>
            )}
          </Pressable>

          {/* Switch mode */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </Text>
            <Pressable
              onPress={() => {
                setError(null);
                setMode(isSignup ? "signin" : "signup");
              }}
              hitSlop={8}
            >
              <Text style={styles.switchLink}>
                {isSignup ? "Sign in" : "Sign up"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footnote}>
          By continuing you agree to our Terms & Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.screen,
    paddingTop: 72,
    paddingBottom: 32,
  },
  brandWrap: { alignItems: "center", marginBottom: 28 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  brand: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
  },
  tagline: {
    marginTop: 6,
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heading: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: theme.fontSize.card,
    color: theme.colors.text,
  },
  eyeBtn: { padding: 4 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: "500",
  },

  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.card,
    fontWeight: "700",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  switchLabel: { fontSize: 13, color: theme.colors.muted },
  switchLink: { fontSize: 13, color: theme.colors.primary, fontWeight: "700" },

  footnote: {
    marginTop: 24,
    fontSize: 11,
    color: theme.colors.muted,
    textAlign: "center",
  },
});