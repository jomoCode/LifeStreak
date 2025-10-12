import ParallaxScrollView from "@/components/parallax-scroll-view";
import EventList from "@/components/ui/molecules/EventList";
import { readEvents, ReadEventsResult } from "@/lib/CRUD_file_system";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const [events, setEvents] = useState<ReadEventsResult>({ pass: "" });
  useEffect(() => {
    const allEvevnts = readEvents();
    setEvents(allEvevnts);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <EventList data={events} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 50,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
