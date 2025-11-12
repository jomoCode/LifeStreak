import React from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { cleanFileName, getTodayMidnightUTC, runSql } from "@/lib/generic_helpers";


type FormValues = {
  eventName: string;
  startDate: string;
  startTime: string;
  interval: string;
  duration: string;
  noOfTimes: string;
};

export default function CreateEventScreen({ navigation }: any) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      eventName: "",
      startDate: getTodayMidnightUTC().split("T")[0],
      startTime: "08:00",
      interval: "1",
      duration: "1",
      noOfTimes: "1",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.eventName.trim()) {
      Alert.alert("Error", "Event name is required");
      return;
    }

    const event_id = `${cleanFileName(data.eventName)}_${Date.now()}`;
    try {
      await runSql(
        `INSERT INTO events (
          event_id, event_name, startDate, startTime, interval, duration, No_of_times_checked, No_of_times_to_be_checked, expired, last_checked
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event_id,
          data.eventName,
          data.startDate,
          data.startTime,
          Number(data.interval),
          Number(data.duration),
          0,
          Number(data.noOfTimes),
          0,
          getTodayMidnightUTC(),
        ]
      );
      Alert.alert("Success", "Event created successfully!");
      reset(); // clear form
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  const renderInput = (name: keyof FormValues, label: string, keyboardType: "default" | "numeric" = "default") => (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
          />
        </>
      )}
    />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>➕ Create New Event</Text>

      {renderInput("eventName", "Event Name")}
      {renderInput("startDate", "Start Date (YYYY-MM-DD)")}
      {renderInput("startTime", "Start Time (HH:MM)")}
      {renderInput("interval", "Interval (days)", "numeric")}
      {renderInput("duration", "Duration (days)", "numeric")}
      {renderInput("noOfTimes", "No of times to be checked", "numeric")}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop:30,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e293b",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    color: "#334155",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  button: {
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
