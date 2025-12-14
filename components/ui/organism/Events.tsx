import { useDb } from "@/context/useBackend";
import { useScreenStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ActionButton } from "../atoms/ActionButton";
import { Title } from "../atoms/Title";
import { LsGoal } from "../molecules/LsGoal";

export const Events = () => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { data, loading, refresh } = useDb();
  const styles = useScreenStyles();
  const onRefresh = async () => {
    setRefreshing(true);
    refresh();
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
              onPress={() => {
                console.log("route to next screen with event id");
              }}
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
