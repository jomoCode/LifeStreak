import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { ActionButton } from "@/components/ui/atoms/ActionButton";
import { LsText } from "@/components/ui/atoms/Title";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const ScheduleScreen = () => {
  const router = useRouter();
  const styles = useGeneralStyles();
  const { setValue } = useFormContext<CreateStreakFormProps>();

  const [type, setType] = useState<"daily" | "custom">("daily");
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ------------------ LOGIC ------------------ */

  const toggleDay = (day: Weekday) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const nextStep = () => {
    if (type === "custom" && selectedDays.length === 0) {
      setError("Select at least one day");
      return;
    }

    const schedule =
      type === "daily"
        ? { type: "daily" }
        : { type: "custom", days: selectedDays };

    setValue("schedule", schedule);
    router.push("/CreateEvents/Review");
  };

  /* ------------------ UI ------------------ */

  return (
    <CreateEvent
      title="How often should this happen?"
      moveToNextStep={nextStep}
      field="schedule"
    >
      {/* SCHEDULE TYPE */}
      <View style={{ gap: 12 }}>
        <LsText variant="sm"> Every day</LsText>
        <ActionButton
          handleSubmit={() => {
            setType("daily");
            setSelectedDays([]);
            setError(null);
          }}
        />

        <LsText variant="sm"> Specific days</LsText>
        <ActionButton handleSubmit={() => setType("custom")} />
      </View>

      {/* WEEKDAY PICKER */}
      {type === "custom" && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.crePageLabel}>Select days</Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {WEEKDAYS.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: active ? "#000" : "#eee",
                  }}
                >
                  <Text style={{ color: active ? "#fff" : "#000" }}>
                    {day.slice(0, 3).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </CreateEvent>
  );
};

export default ScheduleScreen;
