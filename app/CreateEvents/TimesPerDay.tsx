import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const validationRules = {
  required: true,
  min: 1,
  max: 12,
};

const TimesPerDayScreen = () => {
  const styles = useGeneralStyles();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const { control, getValues, setValue } =
    useFormContext<CreateStreakFormProps>();
  const nextStep = () => {
    try {
      // Validate value
      const value = Number(getValues("timesPerDay"));
      if (typeof value != "number") throw new Error("Please enter a number");
      if (!value || value <= 0)
        throw new Error("You need at least 1 time per day");
      if (value > 12) throw new Error("You can do this up to 12 times per day");
      // Update value with validated value before routing
      setValue("timesPerDay", value);
      router.push("/CreateEvents/Review");
    } catch (error: unknown | Error) {
      const errorObj = error as Error;
      setErr(errorObj?.message);
    }
  };

  return (
    <CreateEvent
      field="timesPerDay"
      moveToNextStep={nextStep}
      title="How many times a day?"
    >
      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.crePageLabel}>
              How many times will you do this each day?
            </Text>
            <TextInput
              placeholder="e.g. 3"
              onBlur={onBlur}
              onChangeText={onChange}
              value={`${value}`}
              keyboardType="phone-pad"
              multiline={false}
              style={styles.crePageInput}
            />

            {err && <Text style={{ color: "red" }}>{err}</Text>}
          </View>
        )}
        name="timesPerDay"
      />
    </CreateEvent>
  );
};

export default TimesPerDayScreen;
