import ParallaxScrollView from "@/components/parallax-scroll-view";
import CreateEventForm from "@/components/ui/organism/create_event";
export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<></>}
    >
      <CreateEventForm />
    </ParallaxScrollView>
  );
}
