import { LsButton } from "@/components/ui/atoms/LsButton";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import {
  cleanFileName,
  formatTimeTo12Hour,
  getTodayMidnightUTC,
  runSql,
} from "@/lib/generic_helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { Alert, Text, View } from "react-native";

const ReviewScreen = () => {
  const { getValues, handleSubmit, reset } =
    useFormContext<CreateStreakFormProps>();
  const styles = useGeneralStyles();
  const colors = useColors();
  const router = useRouter();
  const duration = getValues("duration");
  const goal = getValues("eventName");
  const timesPerDay = getValues("noOfTimes");
  const interval = getValues("interval");
  const startDay = getValues("startDate");
  const startTime = getValues("startTime");

  const submit: SubmitHandler<CreateStreakFormProps> = async (data) => {
    // convert and normalize
    const fixedData = {
      ...data,
      interval: Number(data.interval),
      duration: Number(data.duration),
      noOfTimes: Number(data.noOfTimes),
    };

    // Convert startDate to midnight UTC only ONCE
    const startDateISO = getTodayMidnightUTC(fixedData.startDate);

    // Convert startTime properly:
    const startTimeISO = new Date(startDateISO);
    const [hour, minute] = fixedData.startTime.split(":");
    startTimeISO.setUTCHours(Number(hour));
    startTimeISO.setUTCMinutes(Number(minute));
    startTimeISO.setUTCSeconds(0);
    startTimeISO.setUTCMilliseconds(0);

    fixedData.startDate = startDateISO;
    fixedData.startTime = startTimeISO.toISOString();

    const event_id = `${cleanFileName(fixedData.eventName)}_${Date.now()}`;

    try {
      await runSql(
        `INSERT INTO events (
        event_id, event_name, startDate, startTime, interval, duration,
        No_of_times_checked, No_of_times_to_be_checked, expired, last_checked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event_id,
          fixedData.eventName,
          fixedData.startDate,
          fixedData.startTime,
          fixedData.interval,
          fixedData.duration,
          Number(0),
          Number(fixedData.noOfTimes),
          Number(0),
          getTodayMidnightUTC(),
        ]
      );

      Alert.alert("Success", "Event created successfully!", [
        {
          text: "Continue",
          onPress: () => {
            router.push("/");
          },
          style: "default",
        },
      ]);
      reset();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event");
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
          </Text>{" "}
          will be yours.
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
              {formatTimeTo12Hour( startTime)}
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
    </View>
  );
};

export default ReviewScreen;
