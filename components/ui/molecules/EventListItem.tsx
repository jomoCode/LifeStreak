import { tickEvent } from "@/lib/CRUDE_sqlite";
import { getTodayMidnightUTC, runSql } from "@/lib/generic_helpers";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type EventListType = {
  item: {
    event_id: string;
    event_name: string;
    startDate: string;
    startTime: string;
    interval: number;
    duration: number;
    No_of_times_checked: number;
    No_of_times_to_be_checked: number;
    expired: boolean;
    last_checked: string;
  };
  onEventUpdated?: () => void; // optional parent refresh callback
};

export const EventListItem = ({ item, onEventUpdated }: EventListType)  =>{
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(item);

  const today = getTodayMidnightUTC();
  const [checkedToday, setCheckedToday] = useState(
    event.last_checked === today
  );

console.log("check 1: ", event.last_checked, ' + today: ',today);

  const handleTick = async () => {
    if (event.expired) {
      Alert.alert("Not allowed", "This event has expired.");
      return;
    }

    try {
      setLoading(true);
      const result = await tickEvent(event.event_id);
      if (result.success) {
        const updatedEvent = {
          ...event,
          No_of_times_checked: event.No_of_times_checked + 1,
          last_checked: today,
        };
        setEvent(updatedEvent);
        setCheckedToday(true);
        onEventUpdated?.();
      } else {
        Alert.alert("Tick Failed", result.failure || result.error);
      }
    } catch (err) {
      Alert.alert("Error", String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUntick = async () => {
    const today = getTodayMidnightUTC();

    if (event.No_of_times_checked <= 0) {
      Alert.alert("Cannot untick", "Event has not been checked yet.");
      return;
    }

    if (event.last_checked !== today) {
      Alert.alert("Not allowed", "You can only untick events for today.");
      return;
    }

    try {
      setLoading(true);
      await runSql(
        `UPDATE events
         SET No_of_times_checked = No_of_times_checked - 1,
             last_checked = NULL
         WHERE event_id = ?`,
        [event.event_id]
      );

      const updatedEvent = {
        ...event,
        No_of_times_checked: event.No_of_times_checked - 1,
        last_checked: "",
      };

      setEvent(updatedEvent);
      setCheckedToday(false);
      onEventUpdated?.();
      Alert.alert("Success", "Event unticked");
    } catch (err) {
      Alert.alert("Error", String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.id}>{event.event_name}</Text>
      <Text>Start Date: {new Date(event.startDate).toLocaleString()}</Text>
      <Text>Start Time: {new Date(event.startTime).toLocaleTimeString()}</Text>
      <Text>Duration: {event.duration} min</Text>
      <Text>
        Checks: {event.No_of_times_checked}/{event.No_of_times_to_be_checked}
      </Text>
      <Text style={{ color: event.expired ? "red" : "green" }}>
        {event.expired ? "Expired" : "Active"}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="blue"
          style={{ marginTop: 10 }}
        />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: event.expired
                ? "#ccc"
                : checkedToday
                ? "#ff5555"
                : "#4caf50",
            },
          ]}
          disabled={event.expired}
          onPress={checkedToday ? handleUntick : handleTick}
        >
          <Text style={styles.buttonText}>
            {event.expired ? "Expired" : checkedToday ? "Untick" : "Tick"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  id: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
