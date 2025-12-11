import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FlatList,
  Pressable,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

const intervalOptions = [
  { label: "Every day", value: 1 },
  { label: "Every 2 days", value: 2 },
  { label: "Every 3 days", value: 3 },
  { label: "Every 4 days", value: 4 },
  { label: "Every 5 days", value: 5 },
  { label: "Every 6 days", value: 6 },
  { label: "Weekly", value: 7 },
];

const StreakDuration = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [picked, setPicked] = useState<string>();
  const styles = useGeneralStyles();
  const router = useRouter();
  const { getValues, setValue } = useFormContext<CreateStreakFormProps>();
  const handleSelect = (value: number) => {
    setValue("interval", value);
    setShowPicker(false);
    setPicked(`${value} days interval selected`);
  };
  const nextStep = () => {
    // Validate value
    const value = Number(getValues("interval"));
    if (typeof value != "number")
      throw new Error("duration should be a number");
    if (!value || value < 1) throw new Error("interval must be atleast 1 days");
    if (value > 7) throw new Error("interval must be at most 7 days");
    // Update value with validated value before routing
    setValue("interval", value);
    router.push("/CreateEvents/TimesPerDay");
  };

  return (
    <CreateEvent
      field="duration"
      moveToNextStep={nextStep}
      title="How long is your streak?"
    >
      <Pressable
        onPress={() => {
          setShowPicker(!showPicker);
        }}
      >
        <Text style={styles.crePageLabel}>
          <Text>Select number Interval</Text>{" "}
          <MaterialCommunityIcons
            name={showPicker ? "menu-down" : "menu-right"}
            size={20}
          />
        </Text>
      </Pressable>
      {!showPicker && picked && <Text style={styles.title}>{picked}</Text>}
      <View style={{ minHeight: 250 }}>
        {showPicker && (
          <FlatList
            data={intervalOptions}
            keyExtractor={(item) => item.label}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            renderItem={(item) => (
              <TouchableHighlight onPress={() => handleSelect(item.item.value)}>
                <Text style={styles.crePageInput}>{item.item.label}</Text>
              </TouchableHighlight>
            )}
          />
        )}
      </View>
    </CreateEvent>
  );
};

export default StreakDuration;
