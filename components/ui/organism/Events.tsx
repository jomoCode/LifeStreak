import { useDb } from "@/context/useBackend";
import { useScreenStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import {
  filterByAlphabeticOrder,
  filterByCreationDate,
} from "@/lib/generic_helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActionButton } from "../atoms/ActionButton";
import { Title } from "../atoms/Title";
import { LsGoal } from "../molecules/LsGoal";

export const Events = () => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { data, loading, refresh } = useDb();
  const [goals, setGoals] = useState(data);
  const styles = useScreenStyles();
  const colors = useColors();

  useEffect(() => {
    setGoals(data);
  }, [data]);
  const onRefresh = async () => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title variant="lg">Goals</Title>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setGoals(filterByCreationDate(data));
            }}
          >
            <Title variant="sm">
              <MaterialCommunityIcons name="filter" color={colors.button} />
              <MaterialCommunityIcons
                name="sort-ascending"
                color={colors.button}
              />{" "}
            </Title>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setGoals(filterByAlphabeticOrder(data));
            }}
          >
            <Title variant="sm" color={colors.button}>
              <MaterialCommunityIcons name="filter" color={colors.button} />
              A/Z
            </Title>
          </TouchableOpacity>
        </View>
      </View>
      {loading && data.length === 0 ? (
        <Text>Loading events...</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <LsGoal
              streakName={item.event_name}
              onPress={() => {
                router.push(`/HandleGoals/GoalDetails?goalId=${item.event_id}`);
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
