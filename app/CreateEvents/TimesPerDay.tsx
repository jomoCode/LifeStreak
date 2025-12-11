import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import React from "react";
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
  const { control, getValues, setValue } =
    useFormContext<CreateStreakFormProps>();
  const nextStep = () => {
    // Validate value
    const value = Number(getValues("duration"));
    if (typeof value != "number")
      throw new Error("duration should be a number");
    if (!value || value <= 0) throw new Error("streak must be atleast 1 days");
    if (value > 12) throw new Error("Streak must be at most 12 times per days");
    // Update value with validated value before routing
    setValue("duration", value);
    router.push("/CreateEvents/Review");
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
            <Text style={styles.crePageLabel}>How many will you attend to this goal per day</Text>
            <TextInput
              placeholder="Eg: 3"
              onBlur={onBlur}
              onChangeText={onChange}
              value={`${value}`}
              keyboardType="phone-pad"
              multiline={false}
              style={styles.crePageInput}
            />
          </View>
        )}
        name="noOfTimes"
      />
    </CreateEvent>
  );
};

export default TimesPerDayScreen;
