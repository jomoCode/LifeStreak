import { LsButton } from "@/components/ui/atoms/LsButton";
import { AlertTypeEnum, LsAlert } from "@/components/ui/molecules/AlertModal";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { createEvent } from "@/lib/CRUDE_sqlite";
import { formatTimeTo12Hour } from "@/lib/generic_helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";

const ReviewScreen = () => {
  const [alert, setAlert] = useState<{
    title: string;
    type: AlertTypeEnum;
    message: string;
    action: () => any;
    button: string;
  } | null>(null);
  const { getValues, handleSubmit, reset } =
    useFormContext<CreateStreakFormProps>();
  const styles = useGeneralStyles();
  const colors = useColors();
  const router = useRouter();
  const duration = getValues("duration");
  const goal = getValues("event_name");
  const interval = getValues("interval");
  const startDay = getValues("startDate");
  const startTime = getValues("startTime");
  const timesPerDay = getValues("timesPerDay");

  const submit: SubmitHandler<CreateStreakFormProps> = async (data) => {
    try {
      // Convert numeric fields
      const fixedData = {
        ...data,
        interval: Number(data.interval),
        duration: Number(data.duration),
        timesPerDay: Number(data.timesPerDay),
        timeInterval: Number(data.timeInterval),
      };

      // Call your createEvent function
      const result = await createEvent({
        event_name: fixedData.event_name,
        duration: fixedData.duration,
        interval: fixedData.interval,
        startDate: fixedData.startDate, // ISO string or Date string
        startTime: fixedData.startTime, // ISO string or "HH:mm"
        timesPerDay: fixedData.timesPerDay,
        timeInterval: fixedData.timeInterval,
      });

      if ("success" in result) {
        setAlert({
          title: "Success",
          type: "success",
          message: "Event created successfully",
          action: () => {
            router.push("/");
          },
          button: "Continue",
        });

        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown | Error) {
      const errorObj = error as Error;
      const errorMessage = errorObj.message;

      setAlert({
        title: "Failed to create streak!",
        message: errorMessage ? errorMessage : "Error creating events",
        type: "error",
        button: "Try again",
        action: () => {},
      });
    }
  };
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
          <Text style={{ color: colors.button }}>In {duration} days</Text>{" "}
          you’ll have made progress on{" "}
          <Text style={{ color: colors.button, display: "none" }}>
            &quot;{goal}&quot;
          </Text>
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>
          Here’s how your streak will work:
        </Text>
        <View style={{ gap: 8, marginLeft: 4 }}>
          <Text style={{ fontSize: 18, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            {timesPerDay} check-in{timesPerDay > 1 ? "s" : ""} per day
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            {interval === 1 ? "Every day" : `Once every ${interval} days`}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            First check-in:{" "}
            <Text style={{ color: colors.button, fontWeight: "bold" }}>
              {new Date(startDay).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>{" "}
            -{" "}
            <Text style={{ color: colors.button, fontWeight: "bold" }}>
              {startTime? formatTimeTo12Hour(startTime): '------'}
            </Text>
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16, width: "100%" }}>
        <LsButton
          onPress={async () => {
            handleSubmit(submit)();
          }}
          length="long"
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>
            Create my streak{" "}
            <MaterialCommunityIcons name="fire" size={20} color="yellow" />
          </Text>
        </LsButton>
      </View>
      {alert && (
        <LsAlert
          open={!!alert.message}
          handleLeftButton={alert.action}
          leftButtonText={alert.button}
          dismissModal={() => setAlert(null)}
          title={alert.title}
          alertType={alert.type}
          message={alert.message}
        />
      )}
    </View>
  );
};

export default ReviewScreen;
