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

const timeIntervalOptions = [
  { label: "Every 1 hour", value: 1 },
  { label: "Every 2 hours", value: 2 },
  { label: "Every 3 hours", value: 3 },
  { label: "Every 4 hours", value: 4 },
  { label: "Every 6 hours", value: 6 },
  { label: "Every 8 hours", value: 8 },
  { label: "Every 12 hours", value: 12 },
];

const TimeInterval = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [picked, setPicked] = useState<string>();
  const [err, setErr] = useState<string | null>(null);

  const styles = useGeneralStyles();
  const router = useRouter();
  const { getValues, setValue } = useFormContext<CreateStreakFormProps>();

  const handleSelect = (value: number) => {
    setValue("timeInterval", value);
    setPicked(`Every ${value} hour${value > 1 ? "s" : ""}`);
    setShowPicker(false);
    setErr(null);
  };

  const nextStep = () => {
    try {
      const value = Number(getValues("timeInterval"));

      if (!value || Number.isNaN(value)) {
        throw new Error("Please select a time interval");
      }

      if (value < 1) {
        throw new Error("Time interval must be at least 1 hour");
      }

      if (value > 24) {
        throw new Error("Time interval cannot exceed 24 hours");
      }

      setValue("timeInterval", value);
      router.push("/CreateEvents/TimesPerDay");
    } catch (error) {
      setErr((error as Error).message);
    }
  };

  return (
    <CreateEvent
      field="timeInterval"
      moveToNextStep={nextStep}
      title="How often should this repeat in a day?"
    >
      <Pressable onPress={() => setShowPicker(!showPicker)}>
        <Text style={styles.crePageLabel}>
          Choose time interval{" "}
          <MaterialCommunityIcons
            name={showPicker ? "menu-down" : "menu-right"}
            size={20}
          />
        </Text>
      </Pressable>

      {!showPicker && picked && (
        <Text style={styles.title}>{picked}</Text>
      )}

      {err && <Text style={{ color: "red" }}>{err}</Text>}

      <Text style={{ color: "blue" }}>
        This controls how many hours pass before the next event occurs.
      </Text>

      <View style={{ minHeight: 250 }}>
        {showPicker && (
          <FlatList
            data={timeIntervalOptions}
            keyExtractor={(item) => String(item.value)}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => handleSelect(item.value)}>
                <Text style={styles.crePageInput}>{item.label}</Text>
              </TouchableHighlight>
            )}
          />
        )}
      </View>
    </CreateEvent>
  );
};

export default TimeInterval;