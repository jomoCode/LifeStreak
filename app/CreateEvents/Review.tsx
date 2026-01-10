import { LsButton } from "@/components/ui/atoms/LsButton";
import { AlertTypeEnum, LsAlert } from "@/components/ui/molecules/AlertModal";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import {
  insertOccurrenceAsync,
  insertTaskAsync,
} from "@/lib/database/databaseHandlers";
import { initDBAsync } from "@/lib/database/initializeDb";
import { createTask, generateTaskOccurrences } from "@/lib/streakEngine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
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

  const name = getValues("name");
  const schedule = getValues("schedule");
  const startDate = getValues("startDate");
  const endDate = getValues("endDate");
  const totalDays = getValues("totalDays");
  const timeWindow = {
    end: getValues("endTime"),
    start: getValues("startTime"),
  };


  const scheduleLabel =
    schedule?.type === "daily"
      ? "Every day"
      : schedule?.type === "custom"
      ? `On ${schedule.days.join(", ")}`
      : "--";

  const submit: SubmitHandler<CreateStreakFormProps> = (data) => {
    try {
      const task = createTask(data, async (id, task) => {
        const db = await initDBAsync();

        insertTaskAsync(db, task);
        generateTaskOccurrences(task, (id, occurrence) => {
          insertOccurrenceAsync(db, occurrence);
        });
      });

      setAlert({
        title: "Success",
        type: "success",
        message: "Task created successfully",
        action: () => {
          reset();
          router.push("/");
        },
        button: "Continue",
      });
    } catch (error: any) {
      setAlert({
        title: "Failed to create task",
        type: "error",
        message: error?.message ?? "Error creating task",
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
          You’re about to start{" "}
          <Text style={{ color: colors.button }}>{name}</Text>
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 12 }}>
          Here’s how it will work:
        </Text>

        <View style={{ gap: 8, marginLeft: 4 }}>
          <Text style={{ fontSize: 16 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            {scheduleLabel}
          </Text>

          <Text style={{ fontSize: 16 }}>
            <MaterialCommunityIcons
              name="circle"
              color={colors.button}
              size={12}
            />{" "}
            Starts on{" "}
            {new Date(startDate).toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>

          {totalDays && (
            <Text style={{ fontSize: 16 }}>
              <MaterialCommunityIcons
                name="circle"
                color={colors.button}
                size={12}
              />{" "}
              Runs for {totalDays} days
            </Text>
          )}

          {endDate && (
            <Text style={{ fontSize: 16 }}>
              <MaterialCommunityIcons
                name="circle"
                color={colors.button}
                size={12}
              />{" "}
              Ends on {new Date(endDate).toLocaleDateString()}
            </Text>
          )}

          {timeWindow && (
            <Text style={{ fontSize: 16 }}>
              <MaterialCommunityIcons
                name="circle"
                color={colors.button}
                size={12}
              />{" "}
              Between{" "}
              <Text style={{ fontWeight: "bold", color: colors.button }}>
                {timeWindow.start} – {timeWindow.end}
              </Text>
            </Text>
          )}
        </View>
      </View>

      <View style={{ marginTop: 16, width: "100%" }}>
        <LsButton onPress={handleSubmit(submit)} length="long">
          <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>
            Create my task{" "}
            <MaterialCommunityIcons name="check" size={20} color="white" />
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
