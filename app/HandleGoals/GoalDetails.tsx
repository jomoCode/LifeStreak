import { LsText, Title } from "@/components/ui/atoms/Title";
import { useDb } from "@/context/useBackend";
import { Event } from "@/lib/CRUDE_sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

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
            <TouchableOpacity
              key={`${event.eventId}_${index}`}
              style={{
                width: cardSize,
                height: cardSize,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "black",
                margin: cardMargin,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
              onPress={() => setSelectedEvent(event)}
            >
              {/* Faded background icon */}
              <MaterialCommunityIcons
                name={cardAppearance.icon}
                size={cardSize * 0.8}
                color={`${cardAppearance.backgroundColor}33`}
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "10%",
                  zIndex: 0,
                }}
              />

              {/* Card text */}
              <View style={{ zIndex: 1, alignItems: "center" }}>
                <LsText variant="sm" color="black" align="center">
                  {formatRelativeDate(event.scheduledAt)}
                </LsText>
                <LsText variant="sm" color="black" align="center">
                  {eventStatus}
                </LsText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal for full details */}
      <Modal
        visible={!!selectedEvent}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Title variant="med" color="black">{selectedEvent.eventName}</Title>
              <LsText variant="sm" color="black">
                Scheduled:{" "}
                {new Date(selectedEvent.scheduledAt).toLocaleString()}
              </LsText>
              <LsText variant="sm" color="black">
                Day Index: {selectedEvent.dayIndex}, Event Index:{" "}
                {selectedEvent.indexInDay}
              </LsText>
              <TouchableOpacity
                onPress={() => setSelectedEvent(null)}
                style={{
                  marginTop: 10,
                  backgroundColor: "#333",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <LsText variant="sm">
                  Close
                </LsText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default GoalDetails;
