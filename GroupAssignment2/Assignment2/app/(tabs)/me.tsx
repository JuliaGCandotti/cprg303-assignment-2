import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Me() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Me</Text>
        <Pressable style={styles.premiumButton}>
          <Text style={styles.premiumText}>👑 Go Premium</Text>
        </Pressable>
      </View>

      {/* Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#999" />
        </View>
        <Text style={styles.welcomeText}>Welcome, my friend!</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Record</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Kcal</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Minute</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuCard}>
        <Pressable style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.text} />
            <Text style={styles.menuText}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.text} />
            <View>
              <Text style={styles.menuText}>Backup & Restore</Text>
              <Text style={styles.menuSubtext}>Sign in and synchronize your data</Text>
            </View>
          </View>
          <Ionicons name="sync-outline" size={18} color={theme.colors.muted} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="musical-note-outline" size={20} color={theme.colors.text} />
            <Text style={styles.menuText}>My Music</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="person-outline" size={20} color={theme.colors.text} />
            <Text style={styles.menuText}>New Version</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </Pressable>
      </View>

      {/* Weight Section */}
      <View style={styles.weightCard}>
        <View style={styles.weightHeader}>
          <View>
            <View style={styles.weightTitleRow}>
              <Text style={styles.weightTitle}>Weight</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.goalText}>Goal: 65.0 kg</Text>
              <Ionicons name="pencil" size={12} color={theme.colors.muted} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.weightValueRow}>
            <Text style={styles.weightValue}>67.5</Text>
            <Text style={styles.weightUnit}> kg</Text>
            <Ionicons name="pencil" size={12} color={theme.colors.muted} style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Simple Chart */}
        <View style={styles.chart}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            {["68.0", "67.8", "67.5", "67.2", "67.0"].map((label) => (
              <Text key={label} style={styles.axisLabel}>{label}</Text>
            ))}
          </View>

          {/* Chart area */}
          <View style={styles.chartArea}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.gridLine, { top: `${i * 25}%` }]} />
            ))}

            {/* Goal line */}
            <View style={styles.goalLine}>
              <Text style={styles.goalLineLabel}>← Goal: 65.0 kg</Text>
            </View>

            {/* Data point */}
            <View style={styles.dataPoint}>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>67.5</Text>
              </View>
              <View style={styles.dot} />
            </View>

            {/* X-axis */}
            <View style={styles.xAxis}>
              {["13", "14", "15", "16", "17", "18", "19"].map((day) => (
                <Text key={day} style={styles.axisLabel}>{day}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.screen,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
  },
  premiumButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: theme.spacing.screen,
    marginTop: 20,
    padding: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  menuSubtext: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  badge: {
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  weightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: theme.spacing.screen,
    padding: 16,
  },
  weightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  weightTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  goalText: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  weightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  weightValue: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
  },
  weightUnit: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  chart: {
    flexDirection: "row",
    height: 180,
  },
  yAxis: {
    justifyContent: "space-between",
    paddingRight: 8,
  },
  chartArea: {
    flex: 1,
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  goalLine: {
    position: "absolute",
    bottom: "15%",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
  },
  goalLineLabel: {
    position: "absolute",
    right: 0,
    top: 4,
    fontSize: 10,
    color: theme.colors.primary,
  },
  dataPoint: {
    position: "absolute",
    top: "40%",
    left: "40%",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#2d2d3a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: "#fff",
  },
  xAxis: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  axisLabel: {
    fontSize: 11,
    color: theme.colors.muted,
  },
});