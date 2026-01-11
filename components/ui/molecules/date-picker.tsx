import DateTimePicker, { AndroidNativeProps } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";

const StreakDatePicker = ({
  mode,
  currentDate,
}: {
  mode: AndroidNativeProps['mode'] | undefined;
  currentDate: (date: Date) => void;
}) => {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date)
    currentDate(date);
  }, [date]);

  return (
    <DateTimePicker
      mode={mode}
      value={new Date()}
      onChange={(event, selectedDate) => {
         setDate(selectedDate || new Date());
      }}
      display="inline"
    />
  );
};
export { StreakDatePicker };
