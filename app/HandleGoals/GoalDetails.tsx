import { Title } from "@/components/ui/atoms/Title";
import { LsGoalModal } from "@/components/ui/molecules/GoalModal";
import { LsPanel } from "@/components/ui/molecules/LsPanel";
import { useDb } from "@/context/useBackend";
import { Event } from "@/lib/CRUDE_sqlite";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";

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

const calculateEventTime = (
  startTime: string | Date,
  intervalHours: number,
  eventIndex: number
) => {
  const start = new Date(startTime);
  const msToAdd = intervalHours * eventIndex * 60 * 60 * 1000;
  return new Date(start.getTime() + msToAdd);
};

type EventStatus = "missed" | "checked" | "not ready";

const getEventStatus = (
  eventTime: Date,
  eventIndex: number,
  numberOfTimesChecked: number
): EventStatus => {
  const now = new Date();
  if (eventTime > now) return "not ready";
  if (eventIndex < numberOfTimesChecked) return "checked";
  return "missed";
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
type GeneratedEvent = {
  eventId: string;
  eventName: string;
  scheduledAt: string;
  dayIndex: number;
  indexInDay: number;
};

const generateEvents = (eventData: Event): GeneratedEvent[] => {
  const events: GeneratedEvent[] = [];
  const startDay = new Date(eventData.startDate);
  const firstEventTime = new Date(eventData.startTime);

  let activeDayIndex = 0;
  for (
    let dayOffset = 0;
    dayOffset < eventData.duration;
    dayOffset += eventData.interval
  ) {
    const dayDate = new Date(startDay);
    dayDate.setUTCDate(startDay.getUTCDate() + dayOffset);

    for (let i = 0; i < eventData.timesPerDay; i++) {
      const eventTime = new Date(dayDate);
      eventTime.setUTCHours(
        firstEventTime.getUTCHours() + i * eventData.timeInterval
      );
      eventTime.setUTCMinutes(firstEventTime.getUTCMinutes());
      eventTime.setUTCSeconds(firstEventTime.getUTCSeconds());
      eventTime.setUTCMilliseconds(firstEventTime.getUTCMilliseconds());

      events.push({
        eventId: eventData.event_id,
        eventName: eventData.event_name,
        scheduledAt: eventTime.toISOString(),
        dayIndex: activeDayIndex,
        indexInDay: i,
      });
    }
    activeDayIndex++;
  }
  return events;
};

// ---------------------------
// GoalDetails Component
// ---------------------------
const GoalDetails = () => {
  const { data } = useDb();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const goalData = data.find((d) => d.event_id === goalId);
  const [selectedEvent, setSelectedEvent] = useState<GeneratedEvent | null>(
    null
  );

  if (!goalData) return null;
  const streakEvents = generateEvents(goalData);

  // Calculate card size for 4 per row on larger screens
  const screenWidth = Dimensions.get("window").width;
  const cardMargin = 5;
  const cardsPerRow = 4;
  const cardSize =
    (screenWidth - cardMargin * (cardsPerRow * 2) - 20) / cardsPerRow;

  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 10 }}>
      <Title variant="lg" color="black">
        Goal: {goalData.event_name}
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
        {streakEvents.map((event, index) => {
          const eventTime = calculateEventTime(
            event.scheduledAt,
            goalData.timeInterval,
            event.indexInDay
          );

          const eventStatus = getEventStatus(
            eventTime,
            index,
            goalData.No_of_times_checked
          );
          const cardAppearance = getCardAppearance(eventStatus);

          return (
            <LsPanel
              key={`${event.eventId}_${index}`}
              cardAppearance={cardAppearance}
              cardMargin={cardMargin}
              cardSize={cardSize}
              
              onPanelPress={() => setSelectedEvent(event)}
              status={eventStatus}
              text={formatRelativeDate(event.scheduledAt)}
            />
          );
        })}
      </ScrollView>

      {/* Modal for full details */}

      {selectedEvent && (
        <LsGoalModal
          open={!!selectedEvent}
          title={selectedEvent.eventName}
          scheduled={new Date(selectedEvent.scheduledAt).toLocaleString()}
          message={`Day: ${selectedEvent.dayIndex}         Daily Check:${selectedEvent.indexInDay}`}
          dismissModal={() => setSelectedEvent(null)}
          ButtonText="Close"
        />
      )}
    </View>
  );
};

export default GoalDetails;
