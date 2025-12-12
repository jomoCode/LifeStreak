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
      const value = Number(getValues("noOfTimes"));
      if (typeof value != "number")
        throw new Error("Times per day should be a number");
      if (!value || value <= 0)
        throw new Error("streak must be atleast 1 days");
      if (value > 12)
        throw new Error("Streak must be at most 12 times per days");
      // Update value with validated value before routing
      setValue("noOfTimes", value);
      router.push("/CreateEvents/Review");
    } catch (error: unknown | Error) {
      const errorObj = error as Error;
      setErr(errorObj?.message);
    }
  };

  return (
    <CreateEvent
      field="noOfTimes"
      moveToNextStep={nextStep}
      title="How many times per day?"
    >
      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.crePageLabel}>
              How many will you attend to this goal per day
            </Text>
            <TextInput
              placeholder="Eg: 3"
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
        name="noOfTimes"
      />
    </CreateEvent>
  );
};

export default TimesPerDayScreen;
