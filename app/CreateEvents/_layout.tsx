
import { CreateStreakForm } from "@/context/useCreateStreakForm_";
import { Stack } from "expo-router";
const EventCreation = () => {
  return (
      <CreateStreakForm>
        <Stack screenOptions={{ headerShown: false }} />
      </CreateStreakForm>
 
  );
};
export default EventCreation;
