import { LsText, Title } from "@/components/ui/atoms/Title";
import { LsGoalModal } from "@/components/ui/molecules/GoalModal";
import { LsPanel } from "@/components/ui/molecules/LsPanel";
import { useDb } from "@/context/useBackend";
import { Event, untickEvent } from "@/lib/CRUDE_sqlite";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

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

type EventStatus = "missed" | "checked" | "not ready";

const isSameDayUTC = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

const getEventStatus = (
  eventTime: Date,
  indexInDay: number,
  todayCheckedCount: number
): EventStatus => {
  const now = new Date();

  if (eventTime > now) return "not ready";

  if (isSameDayUTC(eventTime, now)) {
    return indexInDay < todayCheckedCount ? "checked" : "missed";
  }

  // past days
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

  //handle checking and unchecking
  const now = new Date();
  const eventDate = new Date(selectedEvent?.scheduledAt ?? "");

  const canUpdate = isSameDayUTC(eventDate, now) && eventDate <= now;

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
          const eventTime = new Date(event.scheduledAt);

          const eventStatus = getEventStatus(
            eventTime,
            event.indexInDay,
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
          message={
            <Text>
              <LsText variant="sm" align="left">
                Day: ${selectedEvent.dayIndex}{" "}
              </LsText>
              {`
               `}
              <LsText variant="sm" align="left">
                Daily Check:${selectedEvent.indexInDay}
              </LsText>
              {`
              
              `}
              {!canUpdate && (
                <LsText variant="sm" align="left">
                  Events not occouring today cannot be updated
                </LsText>
              )}
            </Text>
          }
          dismissModal={() => {
            setSelectedEvent(null);
            untickEvent(selectedEvent.eventId);
          }}
          ButtonText={canUpdate ? "check event" : "close"}
        />
      )}
    </View>
  );
};

export default GoalDetails;
