import { LsButton } from "@/components/ui/atoms/LsButton";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";

const ReviewScreen = () => {
  const { getValues, handleSubmit,  } = useFormContext<CreateStreakFormProps>();
  const styles = useGeneralStyles();
  const colors = useColors();
  const duration = getValues("duration");
  const goal = getValues("eventName");
  const timesPerDay = getValues("noOfTimes");
  const interval = getValues("interval");
  const startDay = getValues("startDate");
  const startTime = getValues("startTime");
  const submit = () => {
    handleSubmit()
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingVertical: 10,
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={styles.crePageLabel}>
          <Text style={{ color: colors.button }}>{duration} days</Text> from
          now,{" "}
          <Text style={{ color: colors.button, display: "none" }}>{goal}</Text>{" "}
          will be yours.
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>
          Build your streak:
        </Text>
        <View style={{ gap: 8, marginLeft: 4 }}>
          <Text style={{ fontSize: 18, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            {timesPerDay} daily check-in{timesPerDay > 1 ? "s" : ""}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            {interval === 1 ? "Daily" : `Every ${interval} days`}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            First check-in:{" "}
            <Text style={{ color: colors.button, fontWeight: "bold" }}>
              {new Date(startDay).toDateString()}
            </Text>{" "}
            -{" "}
            <Text style={{ color: colors.button, fontWeight: "bold" }}>
              {startTime}
            </Text>
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16, width: "100%" }}>
        <LsButton onPress={submit} length="long">
          <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>
            Start my streak{" "}
            <MaterialCommunityIcons name="fire" size={20} color="yellow" />
          </Text>
        </LsButton>
      </View>
    </View>
  );
};

export default ReviewScreen;
