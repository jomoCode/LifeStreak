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
  max: 50,
};

const EventTitle = () => {
  const styles = useGeneralStyles();
  const router = useRouter();
  const { control, getValues, setValue } =
    useFormContext<CreateStreakFormProps>();
  const nextStep = () => {
    // Validate value
    const value = Number(getValues("duration"));
    if (typeof value != "number")
      throw new Error("duration should be a number");
    if (!value || value <= 1) throw new Error("streak must be atleast 2 days");
    if (value > 30) throw new Error("Streak must be at most 30days");
    // Update value with validated value before routing
    setValue("duration", value);
    router.push("/CreateEvents/StreakInterval");
  };

  return (
    <CreateEvent
      field="duration"
      moveToNextStep={nextStep}
      title="How long is your streak?"
    >
      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.crePageLabel}>How long to achieve goal</Text>
            <TextInput
              placeholder="Eg: 28"
              onBlur={onBlur}
              onChangeText={onChange}
              value={`${value}`}
              keyboardType="phone-pad"
              multiline={false}
              style={styles.crePageInput}
            />
          </View>
        )}
        name="duration"
      />
    </CreateEvent>
  );
};

export default EventTitle;
