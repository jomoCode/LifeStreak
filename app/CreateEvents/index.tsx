import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const validationRules = {
  required: true,
  minLength: 3,
  maxLength: 50,
};

const EventTitle = () => {
  const styles = useGeneralStyles();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const { control, getValues } = useFormContext<CreateStreakFormProps>();
  const nextStep = () => {
    try {
      const event = getValues("eventName");
      if (!event) throw new Error("Streak title is required");
      if (event.length <= 1)
        throw new Error("streak title must be atleast 4 characters long", {
          cause: "Invalid client input",
        });
      if (event.length > 50)
        throw new Error("Event name must be most 50 characters long");
      router.push("/CreateEvents/StartDate");
    } catch (error: unknown | Error) {
      const errorObj = error as Error;
      setErr(errorObj?.message);
    }
  };

  return (
    <CreateEvent
      field="eventName"
      moveToNextStep={nextStep}
      title="What do you wish to achieve?"
    >
      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.crePageLabel}>Write your end result</Text>
            <TextInput
              placeholder="Eg: Morning Jog for 10 days"
              onBlur={onBlur}
              onChangeText={(event) => {
                onChange(event);
                setErr(null);
              }}
              value={value}
              multiline={true}
              style={styles.crePageInput}
            />
            {err && <Text style={{ color: "red" }}>{err}</Text>}
          </View>
        )}
        name="eventName"
      />
    </CreateEvent>
  );
};

export default EventTitle;
