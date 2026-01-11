import { ActionButton } from "@/components/ui/atoms/ActionButton";
import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const MAX_DAYS = 30;

const StartDateScreen = () => {
  const router = useRouter();
  const styles = useGeneralStyles();
  const colors = useColors();
  const { setValue, getValues } = useFormContext<CreateStreakFormProps>();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalDays, setTotalDays] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTotalDays, setShowTotalDays] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ------------------ HANDLERS ------------------ */

  const handleStartDateChange = (_: any, date?: Date) => {
    if (!date) {
      setError("Start date is required");
      return;
    }

    setStartDate(date);
    setValue("startDate", date.toISOString().split("T")[0]);
    setShowStartPicker(false);
    setError(null);
  };

  const handleEndDateChange = (_: any, date?: Date) => {
    if (!date) {
      setError("End date is required");
      return;
    }

    setEndDate(date);
    setValue("endDate", date.toISOString().split("T")[0]);
    setValue("totalDays", undefined);
    setShowEndPicker(false);
    setShowTotalDays(false);
    setError(null);
  };

  const handleTotalDaysConfirm = () => {
    if (!startDate) {
      setError("Pick a start date first");
      return;
    }

    const days = Number(totalDays);
    if (!days || days < 2 || days > MAX_DAYS) {
      setError("Total days must be between 2 and 30");
      return;
    }

    const calculatedEnd = new Date(startDate);
    calculatedEnd.setDate(calculatedEnd.getDate() + days - 1);

    setEndDate(calculatedEnd);
    setValue("totalDays", days);
    setValue("endDate", calculatedEnd.toISOString().split("T")[0]);

    setShowTotalDays(false);
    setError(null);
  };

  const nextStep = () => {
    const start = getValues("startDate");
    if (!start) {
      setError("Start date is required");
      return;
    }

    router.push("/CreateEvents/Time");
  };

  /* ------------------ UI ------------------ */

  return (
    <CreateEvent
      title="When do you plan to begin?"
      moveToNextStep={nextStep}
      field="startDate"
    >
      {/* START DATE */}
      {!showStartPicker ? (
        <ActionButton
          containerStyles={{ alignItems: "center" }}
          handleSubmit={() => setShowStartPicker(true)}
        />
      ) : (
        <DateTimePicker
          mode="date"
          minimumDate={new Date()}
          value={startDate ?? new Date()}
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.crePageLabel}>
        Your start date:{" "}
        <Text style={{ fontSize: 16 }}>
          {startDate ? startDate.toDateString() : "-- -- --"}
        </Text>
      </Text>

      {startDate && !error ? (
        <MaterialCommunityIcons
          name="check-outline"
          color={colors.background}
          size={25}
          style={{ textAlign: "center" }}
        />
      ) : (
        error && <Text style={{ color: "red" }}>{error}</Text>
      )}

      {/* END DATE OR TOTAL DAYS */}
      {startDate && !showEndPicker && !showTotalDays && (
        <Text style={{ fontSize: 16 }}>
          Select an <Text onPress={() => setShowEndPicker(true)}>end date</Text>{" "}
          or{" "}
          <Text onPress={() => setShowTotalDays(true)}>
            total number of days
          </Text>{" "}
          (max {MAX_DAYS})
        </Text>
      )}

      {showEndPicker && (
        <DateTimePicker
          mode="date"
          minimumDate={startDate ?? new Date()}
          value={endDate ?? new Date()}
          onChange={handleEndDateChange}
        />
      )}

      {showTotalDays && (
        <View>
          <TextInput
            placeholder="e.g. 14 (max 30)"
            keyboardType="number-pad"
            value={totalDays}
            onChangeText={setTotalDays}
            style={styles.crePageInput}
          />
          <ActionButton
            containerStyles={{ alignItems: "center" }}
            handleSubmit={handleTotalDaysConfirm}
          />
        </View>
      )}
    </CreateEvent>
  );
};

export default StartDateScreen;
