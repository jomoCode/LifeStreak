import { LsText, Title } from "@/components/ui/atoms/Title";
import { useDb } from "@/context/useBackend";
import { useColors } from "@/hooks/useColors";
import { Event } from "@/lib/CRUDE_sqlite";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { View } from "react-native";

// create container with a fixed width and height 5 column wide
//inside create a time container wih a fixed widith and height 1:5..
// for each time the event should be ticked, map over the inner container. allow wrapping so it continiues on the next line when it reaches its five maximum per line.

//deprecated attempt
// bug found: we our data structure doesnt record when an event ticked. i.e it' time stamp
//we can create a check history:
// it will be an array for simplicity and low data storage
//array will by default be full of 'uu'. each uu will represent the total nu of times to be checked. i.e No_of_times_to_be_checked X duration. [uu, uu]
//helpers we'd need.. one to find out what day we are on.. this will:
// - take note of today
//  - calculate current day based of todday - start day//whike accounting for intervals

// todo
// each time a goal is checked, update  and persist an  array goalHistory: [] with the timestamp of when the event was clicked
// a function takes in the goal history and returns  an an array of objects :
// status: 'missed'|'checked'|''toBe checked'
//date: date
// time: time
// iterrate yjod yoo much

// types.ts
type EventScheduleInput = Event;

type GeneratedEvent = {
  event_id: string;
  event_name: string;
  scheduledAt: string; // ISO timestamp
  dayIndex: number; // nth active day
  indexInDay: number; // nth event in that day
};

const generateEvents = (input: EventScheduleInput) => {
  const events: GeneratedEvent[] = [];
  const startDay = new Date(input.startDate);
  const firstEventTime = new Date(input.startTime);

  let activeDayIndex = 0;

  for (
    let dayOffset = 0;
    dayOffset < input.duration;
    dayOffset += input.interval
  ) {
    const dayDate = new Date(startDay);
    dayDate.setUTCDate(startDay.getUTCDate() + dayOffset);

    for (let i = 0; i < input.timesPerDay; i++) {
      const eventTime = new Date(dayDate);
      eventTime.setUTCHours(
        firstEventTime.getUTCHours() + i * input.timeInterval
      );
      eventTime.setUTCMinutes(firstEventTime.getUTCMinutes());
      eventTime.setUTCSeconds(firstEventTime.getUTCSeconds());
      eventTime.setUTCMilliseconds(firstEventTime.getUTCMilliseconds());

      events.push({
        event_id: input.event_id,
        event_name: input.event_name,
        scheduledAt: eventTime.toISOString(),
        dayIndex: activeDayIndex,
        indexInDay: i,
      });
    }

    activeDayIndex++;
  }

  return events;
};

const GoalDetails = () => {
  const { data, refresh } = useDb();
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const colors = useColors();
  const roomData = data.find((data) => data.event_id === goalId);
  if (!roomData) {
    return;
  }
  const streakEvents = generateEvents(roomData);

  return (
    <View>
      <Title variant="lg" color="black">
        Goal: {roomData?.event_name}
      </Title>
      <View
        style={{
          backgroundColor: "blue",
          width: 300,
          height: "auto",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {streakEvents.map((item) => (
          <View key={item.event_id} style={{ backgroundColor: "yellow" }}>
            <LsText variant="sm">lalal</LsText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GoalDetails;
