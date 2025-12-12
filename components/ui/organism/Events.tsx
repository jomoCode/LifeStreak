import { useScreenStyles } from "@/hooks/styles/useStyles";
import { Event as EventType, readEvents } from "@/lib/CRUDE_sqlite";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ActionButton } from "../atoms/ActionButton";
import { Title } from "../atoms/Title";
import { LsGoal } from "../molecules/LsGoal";

export const Events = () => {
  const [data, setData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const styles = useScreenStyles();
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
      console.log("my events: ", events);
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
      <Title variant="lg">Goals</Title>
      {loading && data.length === 0 ? (
        <Text>Loading events...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <LsGoal
              streakName={item.event_name}
              onPress={() => "route to next screen with event id"}
            />
          )}
          ListEmptyComponent={
            <Title variant="lg">Create a goal to start your streak</Title>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <ActionButton
        handleSubmit={() => {
          router.push("/CreateEvents");
        }}
      />
    </View>
  );
};
