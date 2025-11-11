import { ReadEventsResult } from "@/lib/CRUD_file_system";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type EventListProps = {
  data: ReadEventsResult;
};

const EventList = ({ data }: EventListProps) => {
  if ("error" in data) {
    return <Text style={styles.message}>Error: {`${data.error}`}</Text>;
  }
  if ("fail" in data) {
    return <Text style={styles.message}>No events saved yet</Text>;
  }
  if ("pass" in data) {
    return <Text style={styles.message}>Pass: {`${data.pass}`}</Text>;
  }

  const events = Object.entries(data).map(([key, event]) => ({
    id: key,
    ...event,
  }));

  return (
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
            Checks: {item.No_of_times_checked}/{item.No_of_times_to_be_checked}
          </Text>
          <Text style={{ color: item.expired ? "red" : "green" }}>
            {item.expired ? "Expired" : "Active"}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.message}>No events found</Text>}
    />
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
