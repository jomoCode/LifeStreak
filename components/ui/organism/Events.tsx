import { Event as EventType, readEvents } from "@/lib/CRUDE_sqlite";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { EventListItem } from "../molecules/EventListItem";
/**
 * Organism: Events
 * Handles fetching, rendering, and refreshing all stored events.
 */
export  const Events = () => {
  const [data, setData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadEventsFromDb = useCallback(async () => {
    try {
      setLoading(true);
      const events = await readEvents();

      if (!events) {
        setData([]);
        return;
      }

      if (typeof events === "object") {
        if ("error" in events) {
          console.error("Error reading events:", events.error);
          setData([]);
          return;
        }
        if ("fail" in events) {
          setData([]);
          return;
        }
        if ("pass" in events) {
          console.log("Pass message:", events.pass);
          setData([]);
          return;
        }
      }

      setData(events);
    } catch (err) {
      console.error("Error loading events:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEventsFromDb();
  }, [loadEventsFromDb]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEventsFromDb();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {loading && data.length === 0 ? (
        <Text style={styles.message}>Loading events...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <EventListItem item={item} onEventUpdated={loadEventsFromDb} />
          )}
          ListEmptyComponent={
            <Text style={styles.message}>No events found</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#f0f0f0",
  },
  message: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: "gray",
  },
});
