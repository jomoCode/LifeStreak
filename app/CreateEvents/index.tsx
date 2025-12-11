import { CreateEvent } from "@/components/ui/Template/CreateEvent";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const validationRules = {
  required: true,
  minLength: 3,
  maxLength: 50,
};

const EventTitle = () => {
  const styles = useGeneralStyles();
  const router = useRouter();
  const { control, getValues } = useFormContext<CreateStreakFormProps>();
  const nextStep = () => {
    const event = getValues('eventName');
    if (!event) throw new Error('Streak title is required');
    if (event.length <= 1) throw new Error('streak title must be atleast 4 characters long');
    if (event.length > 50) throw new Error('Event name must be most 50 characters long')
    router.push("/CreateEvents/StartDate");
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
              placeholder="Eg: Morning Jog 30mins for 10 days"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline={true}
              style={styles.crePageInput}
            />
          </View>
        )}
        name="eventName"
      />
    </CreateEvent>
  );
};

export default EventTitle;
