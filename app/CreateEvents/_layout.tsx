import { StreakFormProvider } from "@/context/useCreateStreakForm";
import { Stack } from "expo-router";

const EventCreation = () => {
  return (
    <StreakFormProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </StreakFormProvider>
  );
};
export default EventCreation;
