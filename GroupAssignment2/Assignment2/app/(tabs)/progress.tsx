// placeholder!!
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { theme } from "@/styles/theme";
import { useState } from "react";
import HorizontalSection from "@/components/horizontalSection";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import VerticalSection from "@/components/verticalSection";
import ProgressCard from "@/components/progressCard";

export default function ProgressScreen() {
  const [selected, setSelected] = useState(
    LocaleConfig.defaultLocale === "en"
      ? new Date().toISOString().split("T")[0]
      : new Date().toLocaleDateString("en-CA").split("/").reverse().join("-"),
  );

  const [records, setRecords] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Progress</Text>
      {/* Calendar */}
      <View>
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          // current={}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: theme.colors.muted,
            },
          }}
        />
      </View>

      {/* Workout Library */}
      <View style={styles.workoutLibrary}>
        <Text style={styles.section}>Workout Library</Text>
        <View style={styles.quickSearchCard}>
          <LinearGradient
            colors={[
              "rgba(81, 70, 238, 1)",
              "rgba(138, 101, 240, 1)",
              "rgba(199, 112, 189, 1)",
            ]}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.quickSearchContainer}>
              <Ionicons
                name="search-outline"
                size={36}
                color={theme.colors.white}
              />
              <View style={styles.quickSearchTextContainer}>
                <Text style={styles.quicklySearch}>Quickly Search</Text>
                <Text style={styles.quickSearchText}>
                  For workouts You Need
                </Text>
              </View>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color="transparent"
                backgroundColor="white"
                borderRadius={100}
                padding={10}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
      <VerticalSection title={selected} subtitle={`${records} Records`}>
        <ProgressCard />
        <Pressable>
          <Text style={styles.buttonText}>Start a Workout</Text>
        </Pressable>
      </VerticalSection>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ gap: 16 }}
        style={styles.progressContainer}
      >
        <View>
          <Text style={styles.section}>{selected}</Text>
          <Text style={styles.subtitle}>Records: {records}</Text>
        </View>
        <View style={styles.progressList}></View>
        <Pressable>
          <Text style={styles.buttonText}>View Details</Text>
        </Pressable>
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.bg,
  },
  header: {
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.muted,
  },
  calendar: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
  },

  workoutLibrary: {
    marginBottom: 16,
  },
  section: {
    fontSize: theme.fontSize.section,
    fontWeight: "600",
    color: theme.colors.text,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 25,
  },
  quickSearchCard: {
    borderRadius: 25,
    width: "100%",
    height: 100,
  },
  quickSearchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  quickSearchTextContainer: {
    marginLeft: 16,
  },
  quickSearchText: {
    color: theme.colors.white,
  },
  quicklySearch: {
    fontSize: theme.fontSize.section,
    fontWeight: "800",
    color: theme.colors.white,
  },
  progressContainer: {
    width: "100%",
    height: 150,
    padding: theme.spacing.gap,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollView: {
    marginTop: 16,
  },
  progressList: {
    gap: theme.spacing.gap,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonText: {
    marginTop: 16,
    padding: 16,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.button,
    fontSize: theme.fontSize.card,
    color: theme.colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
});
