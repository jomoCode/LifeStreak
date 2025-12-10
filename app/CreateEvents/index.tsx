import { LsButton } from "@/components/ui/atoms/LsButton";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const EventTitle = () => {
  const { control, getFieldState, watch } =
    useFormContext<CreateStreakFormProps>();
  const { error } = getFieldState("eventName");
  const styles = useGeneralStyles();
  const router = useRouter();
  const moveToNextStep = () => {
    router.push("/CreateEvents/StartDate");
  };

  return (
    <View style={styles.crePageContainer}>
      <Text style={styles.crePageTitle}>What do you wish to achieve?</Text>
      <Controller
        control={control}
        rules={{
          required: true,
          min: 3,
          max: 50,
        }}
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
      {error && <Text>{error.message}</Text>}
      <View style={styles.crePageButtonContainer}>
        <LsButton onPress={moveToNextStep}>
          <MaterialIcons
            name="arrow-forward"
            size={35}
            style={styles.crePageButtonIcon}
          />
        </LsButton>
      </View>
    </View>
  );
};

export default EventTitle;
