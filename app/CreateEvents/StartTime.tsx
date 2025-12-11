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

const StartTimeScreen = () => {
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
    const time = date.toLocaleTimeString().toString();
    const timeArray = time.split(":");
    if (timeArray[0].length === 1) timeArray[0] = "0" + timeArray[0];
    const formattedTime = `${timeArray[0]}:${timeArray[1]}`;
    console.log("final selected time: ", formattedTime);
    setValue("startTime", formattedTime);
  };

  const nextStep =() => {
    router.push('/CreateEvents/StreakDuration')
  };
  return (
    <CreateEvent title="What time?" moveToNextStep={nextStep} field="startTime">
      {!calendar ? (
        <ActionButton
          containerStyles={{ alignItems: "center" }}
          handleSubmit={() => {
            setCalendar(true);
          }}
        />
      ) : (
        <DateTimePicker
          mode="time"
          value={calendarValue ? calendarValue : new Date()}
          onChange={setDate}
        />
      )}

      <Text style={styles.crePageLabel}>
        Selected Time:{" "}
        <Text style={{ color: "black", fontSize: 16 }}>
          {calendarValue ? calendarValue.toLocaleTimeString() : "-- -- --"}
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

export default StartTimeScreen;
