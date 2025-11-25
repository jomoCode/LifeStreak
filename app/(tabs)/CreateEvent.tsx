import {
  cleanFileName,
  getTodayMidnightUTC,
  runSql,
} from "@/lib/generic_helpers";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

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

    // convert and normalize
    const fixedData = {
      ...data,
      interval: Number(data.interval),
      duration: Number(data.duration),
      noOfTimes: Number(data.noOfTimes),
    };

    // Convert startDate to midnight UTC only ONCE
    const startDateISO = getTodayMidnightUTC(fixedData.startDate);

    // Convert startTime properly:
    const startTimeISO = new Date(startDateISO);
    const [hour, minute] = fixedData.startTime.split(":");
    startTimeISO.setUTCHours(Number(hour));
    startTimeISO.setUTCMinutes(Number(minute));
    startTimeISO.setUTCSeconds(0);
    startTimeISO.setUTCMilliseconds(0);

    fixedData.startDate = startDateISO;
    fixedData.startTime = startTimeISO.toISOString();

    const event_id = `${cleanFileName(fixedData.eventName)}_${Date.now()}`;

    try {
      await runSql(
        `INSERT INTO events (
        event_id, event_name, startDate, startTime, interval, duration,
        No_of_times_checked, No_of_times_to_be_checked, expired, last_checked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event_id,
          fixedData.eventName,
          fixedData.startDate,
          fixedData.startTime,
          fixedData.interval,
          fixedData.duration,
          Number(0),
          Number(fixedData.noOfTimes),
          Number(0),
          getTodayMidnightUTC(),
        ]
      );

      Alert.alert("Success", "Event created successfully!");
      reset();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  const renderInput = (
    name: keyof FormValues,
    label: string,
    keyboardType: "default" | "numeric" = "default"
  ) => (
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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
    paddingTop: 30,
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
