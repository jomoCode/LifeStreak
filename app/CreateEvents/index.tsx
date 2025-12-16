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
      if (!event) {
        throw new Error("Please enter a streak title");
      }

      if (event.length < 4) {
        throw new Error("Streak title must be at least 4 characters long");
      }

      if (event.length > 50) {
        throw new Error("Streak title must be 50 characters or less");
      }
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
      title="What habit do you want to build?"
    >
      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.crePageLabel}>
              Give your streak a clear name
            </Text>
            <TextInput
              placeholder="e.g. Morning jog for 10 days"
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
