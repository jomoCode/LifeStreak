import { ActionButton } from "@/components/ui/atoms/ActionButton";
import { LsText } from "@/components/ui/atoms/Title";
import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const StartTimeScreen = () => {
  const router = useRouter();
  const styles = useGeneralStyles();
  const colors = useColors();
  const { setValue, getValues } = useFormContext<CreateStreakFormProps>();

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ------------------ HANDLERS ------------------ */

  const handleStartTimeChange = (_: any, date?: Date) => {
    if (!date) {
      setError("Start time is required");
      return;
    }

    setStartTime(date);
    setValue("startTime", formatTime(date));
    setShowStartPicker(false);
    setError(null);
  };

  const handleEndTimeChange = (_: any, date?: Date) => {
    if (!date) {
      setError("End time is required");
      return;
    }

    if (startTime && date <= startTime) {
      setError("End time must be after start time");
      return;
    }

    setEndTime(date);
    setValue("endTime", formatTime(date));
    setShowEndPicker(false);
    setError(null);
  };

  const nextStep = () => {
    const start = getValues("startTime");
    const end = getValues("endTime");

    if (!start || !end) {
      setError("Please select both start and end times");
      return;
    }

    router.push("/CreateEvents/Schedule");
  };

  /* ------------------ UI ------------------ */

  return (
    <CreateEvent
      title="When should it happen?"
      moveToNextStep={nextStep}
      field="startTime"
    >
      {/* START TIME */}
      {!showStartPicker ? (
        <View>

      <Text>end:</Text>  
        <ActionButton
          containerStyles={{ alignItems: "center" }}
          handleSubmit={() => setShowStartPicker(true)}
        />
</View>
      ) : (
        <DateTimePicker
          mode="time"
          value={startTime ?? new Date()}
          onChange={handleStartTimeChange}
        />
      )}

      <Text style={styles.crePageLabel}>
        Start time:{" "}
        <Text style={{ fontSize: 16 }}>
          {startTime ? formatTime(startTime) : "--:--"}
        </Text>
      </Text>

      {startTime && (
        <MaterialCommunityIcons
          name="check-outline"
          color={colors.background}
          size={25}
          style={{ textAlign: "center" }}
        />
      )}

      {/* END TIME */}
      {startTime && !showEndPicker && (
        <View>
          <LsText  variant="sm">start:</LsText>
        <ActionButton
          containerStyles={{ alignItems: "center", marginTop: 12 }}
          handleSubmit={() => setShowEndPicker(true)}
        />
</View>
      )}

      {showEndPicker && (
        <DateTimePicker
          mode="time"
          value={endTime ?? new Date()}
          onChange={handleEndTimeChange}
        />
      )}

      <Text style={styles.crePageLabel}>
        End time:{" "}
        <Text style={{ fontSize: 16 }}>
          {endTime ? formatTime(endTime) : "--:--"}
        </Text>
      </Text>

      {endTime && (
        <MaterialCommunityIcons
          name="check-outline"
          color={colors.background}
          size={25}
          style={{ textAlign: "center" }}
        />
      )}

      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </CreateEvent>
  );
};

export default StartTimeScreen;

