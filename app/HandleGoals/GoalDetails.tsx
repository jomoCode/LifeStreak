import { useDb } from "@/context/useBackend";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { Text, View } from "react-native";

const GoalDetails = () => {
  const { data, refresh } = useDb();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const roomData = data.find((data) => data.event_id === goalId);
  console.log("ROOM DATA:", roomData);

  return (
    <View>
      <Text>GoalDetails</Text>
    </View>
  );
};

export default GoalDetails;
