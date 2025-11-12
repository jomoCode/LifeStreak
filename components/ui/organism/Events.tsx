import { Event, readEvents } from "@/lib/CRUDE_sqlite";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const EventList = () => {
  const [data, setData] = useState<Event[]>();
  useEffect(() => {
    const allEvents = async () => {
      const events = await readEvents();

      if (events && typeof events === "object") {
        if ("error" in events) {
          return <Text style={styles.message}>Error: {`${events.error}`}</Text>;
        }
        if ("fail" in events) {
          return <Text style={styles.message}>No events saved yet</Text>;
        }
        if ("pass" in events) {
          return <Text style={styles.message}>Pass: {`${events.pass}`}</Text>;
        }
      } else {
        console.log("MY DATA: ", data);
        return <Text style={styles.message}>Loading or invalid data</Text>;
      }

      setData(events);
    };
    allEvents();
  }, []);

  const events = data
    ? Object.entries(data).map(([key, event]) => ({
        id: key,
        ...event,
      }))
    : [];

  return (
    <View style={{ flex: 1, paddingTop: 30, backgroundColor: "green" }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.event_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>Event ID: {item.event_id}</Text>
            <Text>Start Date: {new Date(item.startDate).toLocaleString()}</Text>
            <Text>
              Start Time: {new Date(item.startTime).toLocaleTimeString()}
            </Text>
            <Text>Duration: {item.duration} min</Text>
            <Text>
              Checks: {item.No_of_times_checked}/
              {item.No_of_times_to_be_checked}
            </Text>
            <Text style={{ color: item.expired ? "red" : "green" }}>
              {item.expired ? "Expired" : "Active"}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.message}>No events found</Text>}
      />
    </View>
  );
};

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
  message: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default EventList;
