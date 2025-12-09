import { LsButton } from "@/components/ui/atoms/LsButton";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";

export default function ReviewScreen() {
  const streak = useStreakForm();
  const router = useRouter();

  const handleSubmit = () => {
    streak.submit((values) => {
      // Here you would handle the final submission, e.g., API call or database insert
      Alert.alert("Success", "Streak created successfully!", [
        { text: "OK", onPress: () => router.push("/") }, // Redirect to home or list
      ]);
      streak.resetForm(); // Optional: clear the form
    });
  };

  const reviewItems = [
    { label: "Goal Title", value: streak.form.goalTitle },
    { label: "Start Date", value: streak.form.startDate },
    { label: "Start Time", value: streak.form.startTime ?? "Not set" },
    { label: "Interval (days)", value: streak.form.interval },
    { label: "Duration (days)", value: streak.form.duration },
    { label: "Times per day", value: streak.form.timesPerDay },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Review Streak</Text>

      {reviewItems.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{String(item.value)}</Text>
        </View>
      ))}

      <LsButton onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Streak</Text>
      </LsButton>

      <LsButton onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </LsButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8fafc",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e293b",
  },
  item: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#64748b",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
