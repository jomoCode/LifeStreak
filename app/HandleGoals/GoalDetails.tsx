import { LsText, Title } from "@/components/ui/atoms/Title";
import { LsGoalModal } from "@/components/ui/molecules/GoalModal";
import { LsPanel } from "@/components/ui/molecules/LsPanel";
import { useDb } from "@/context/useBackend";
import { useOccurrences } from "@/hooks/useOccourences";
import { markOccurrenceChecked } from "@/lib/database/helpers";
import { buildOccurrenceCards, mapOccurrenceStatus } from "@/lib/helpers";
import { TaskOccurrenceStatus } from "@/lib/streakEngine";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";

//update event or check event:
// we use local storage here.
// when an event is clicked, we note in local storage that such an event was clicked once. if the event is unclicked we subtract 1 from from that event.
//after this we can then update our sqlite db: no of times checked column
//on click event and click on check, local storage todaysEventUpdate = {indexDay1: 1};
//click second event for the day and click on check, local storage todaysEventUpdate = {indexDay1: 1, indexInDay2:1};
//on click event one and click on now we should see uncheck, local storage todaysEventUpdate = {indexDay1: indexDay2:1};b
// we can the use the object to update our number of times checked by adding all the clicked events and updating the our sqlite no of times checked.
// clean up: we would need to clean up each day, so the number of events of a previous day to over lap into the currnt day. to do so, we need to...
//take note of today. and it if does not tally with the date saved in local storage, we delete the entire event hstory from our local storage before stratinng tracking.
//e.g {today:Date, indexDay1: ...};
//if (todaysEventUpdate.today != new Date()...){} //delete the local storage and start afresh.

//updatting the db:

// ---------------------------
// Utils
// ---------------------------
export const formatRelativeDate = (inputDate: string | Date) => {
  const date = new Date(inputDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((target.getTime() - today.getTime()) / msPerDay);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  if (diffDays > 1) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

const getCardAppearance = (status: EventStatus) => {
  switch (status) {
    case "missed":
      return { icon: "close", backgroundColor: "#ff4d4f" } as const;
    case "checked":
      return { icon: "check", backgroundColor: "#ffd700" } as const;
    case "not ready":
      return { icon: "dots-horizontal", backgroundColor: "#4caf50" } as const;
  }
};

// ---------------------------
// Event Generation
// ---------------------------

type EventStatus = "missed" | "checked" | "not ready";

// ---------------------------
// GoalDetails Component
// ---------------------------
// GoalDetails.tsx

const GoalDetails = () => {
  const { data } = useDb();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();

  const task = data.find((t) => t.id === goalId);
  const { occurrences } = useOccurrences(goalId ?? "");

  const [selected, setSelected] = useState<{
    id: string;
    scheduledAt: Date;
    status: TaskOccurrenceStatus;
  } | null>(null);

  if (!task) return null;

  const cards = buildOccurrenceCards(task, occurrences);

  const screenWidth = Dimensions.get("window").width;
  const cardMargin = 5;
  const cardsPerRow = 4;
  const cardSize =
    (screenWidth - cardMargin * (cardsPerRow * 2) - 20) / cardsPerRow;

  const now = new Date();
  const canUpdate =
    selected &&
    selected.scheduledAt <= now &&
    selected.scheduledAt.toDateString() === now.toDateString();

  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
      <Title variant="lg" color="black">
        Goal: {task.name}
      </Title>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 10,
          gap: 10,
        }}
      >
        {cards.map((card) => {
          const status = mapOccurrenceStatus(card.scheduledAt, card.status);

          const appearance = getCardAppearance(status);

          return (
            <LsPanel
              key={card.id}
              cardAppearance={appearance}
              cardMargin={cardMargin}
              cardSize={cardSize}
              onPanelPress={() => setSelected(card)}
              status={status}
              text={formatRelativeDate(card.scheduledAt)}
            />
          );
        })}
      </ScrollView>

      {selected && (
        <LsGoalModal
          open
          title={task.name}
          scheduled={selected.scheduledAt.toLocaleString()}
          message={
            <LsText variant="sm" align="left">
              This occurrence is scheduled for today.
            </LsText>
          }
          ButtonText={canUpdate ? "check event" : "close"}
          dismissModal={async () => {
            if (canUpdate) {
              await markOccurrenceChecked(
                selected.id,
                selected.scheduledAt.toISOString().split("T")[0] // YYYY-MM-DD
              );
            }
            setSelected(null);
          }}
        />
      )}
    </View>
  );
};

export default GoalDetails;
