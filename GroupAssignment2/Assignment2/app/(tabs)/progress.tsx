// placeholder!!
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { theme } from "@/styles/theme";
import { useState } from "react";
import HorizontalSection from "@/components/horizontalSection";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ProgressCard from "@/components/progressCard";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ProgressScreen() {
  const [selected, setSelected] = useState(
    LocaleConfig.defaultLocale === "en"
      ? new Date().toISOString().split("T")[0]
      : new Date().toLocaleDateString("en-CA").split("T")[0],
  );

  const [records, setRecords] = useState(0);

  return (
    <ScrollView style={styles.container}>
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
        {/* <View style={styles.quickSearchCard}> */}
        <LinearGradient
          colors={[
            "rgba(81, 70, 238, 1)",
            "rgba(138, 101, 240, 1)",
            "rgba(199, 112, 189, 1)",
          ]}
          style={styles.quickSearchCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.quickSearchContainer}>
            <Ionicons
              name="search-outline"
              size={42}
              color={theme.colors.white}
            />
            <View style={styles.quickSearchTextContainer}>
              <Text style={styles.quicklySearch}>Quickly Search</Text>
              <Text style={styles.quickSearchText}>For workouts You Need</Text>
            </View>
            <Ionicons
              name="arrow-forward-outline"
              size={20}
              color="inherit"
              backgroundColor="white"
              borderRadius={100}
              padding={16}
            />
          </View>
        </LinearGradient>
        {/* </View> */}
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={styles.section}
            >{`${monthNames[new Date(selected).getMonth()]}. ${new Date(selected).getFullYear()}`}</Text>
            <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.historyText}>All history</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color="blue"
                borderRadius={100}
                padding={10}
              />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>{`${records} Records`}</Text>
        </View>
        <View style={styles.progressList}>
          {records > 0 ? (
            <ProgressCard />
          ) : (
            <Text
              style={{
                ...styles.subtitle,
                fontSize: theme.fontSize.section,
                textAlign: "center",
                marginTop: 40,
              }}
            >
              No records this month yet. Come and start now!
            </Text>
          )}
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start a Workout</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    marginTop: 24,
    marginBottom: 24,
  },
  section: {
    fontSize: theme.fontSize.section,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
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
    marginBottom: theme.spacing.gap,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.gap,
    minHeight: 300,
  },
  scrollView: {
    marginTop: 16,
  },
  historyText: {
    fontSize: theme.fontSize.subtitle,
    color: "blue",
  },
  progressList: {
    marginTop: 16,
    flexDirection: "column",
    flexGrow: 1,

    // flexWrap: "wrap",
  },
  button: {
    backgroundColor: theme.colors.button,
    borderRadius: theme.radius.button,
    bottom: 0,
    top: "auto",
    padding: 16,
    marginTop: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: theme.fontSize.card,
    color: theme.colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
});
