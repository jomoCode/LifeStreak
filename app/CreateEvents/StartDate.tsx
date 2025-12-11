import { ActionButton } from "@/components/ui/atoms/ActionButton";
import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Text } from "react-native";

const StartDateScreen = () => {
  const [calendarValue, setCalendarValue] = useState<Date>();
  const [calendar, setCalendar] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const color = useColors();
  const { setValue, getValues } = useFormContext<CreateStreakFormProps>();
  const styles = useGeneralStyles();
  const setDate = (event: DateTimePickerEvent, date?: Date) => {
    try {
      // Validate props
      if (!date) throw new Error("No date selected");
      if (date) setCalendarValue(date);

      // Update form states
      setCalendar(false);
      setErr(null);
      setValue("startDate", date.toISOString().split("T")[0]);
    } catch (error: unknown | Error) {
      const errorObj = error as Error;
      setErr(errorObj?.message);
    }
  };
  const nextStep = () => {
    const startDate = getValues("startDate");
    // validare form values
    if (!startDate || startDate.length < 4) {
      setErr("Start date is required");
      return;
    }
    router.push("/CreateEvents/StartTime");
  };
  return (
    <CreateEvent
      title="When do you plan to begin"
      moveToNextStep={nextStep}
      field="startDate"
    >
      {!calendar ? (
        <ActionButton
          containerStyles={{ alignItems: "center" }}
          handleSubmit={() => {
            setCalendar(true);
          }}
        />
      ) : (
        <DateTimePicker
          mode="date"
          value={calendarValue ? calendarValue : new Date()}
          dateFormat="longdate"
          minimumDate={new Date()}
          onChange={setDate}
        />
      )}

      <Text style={styles.crePageLabel}>
        Selected Date:{" "}
        <Text style={{ color: "black", fontSize: 16 }}>
          {calendarValue ? calendarValue.toDateString() : "-- -- --"}
        </Text>
      </Text>
      <Text>
        {calendarValue && !err ? (
          <MaterialCommunityIcons
            name="check-outline"
            color={color.background}
            size={25}
            style={{ textAlign: "center" }}
          />
        ) : (
          <Text style={{ color: "red" }}>{err}</Text>
        )}
      </Text>
    </CreateEvent>
  );
};

export default StartDateScreen;
