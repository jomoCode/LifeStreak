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
  const router = useRouter();
  const color = useColors();
  const { setValue } = useFormContext<CreateStreakFormProps>();
  const styles = useGeneralStyles();
  const setDate = (event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      console.error("No date selected: ");
      return null;
    }
    if (date) setCalendarValue(date);
    setCalendar(false);
    setValue("startDate", date.toISOString().split("T")[0]);
  };
  const nextStep = () => {
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
        {calendarValue && (
          <MaterialCommunityIcons
            name="check-outline"
            color={color.background}
            size={25}
            style={{ textAlign: "center" }}
          />
        )}
      </Text>
    </CreateEvent>
  );
};

export default StartDateScreen;
