import { StreakFormProvider } from "@/context/useCreateStreakForm";
import { Stack } from "expo-router";

const EventCreation = () => {
  return (
    <StreakFormProvider>
      <Stack />
    </StreakFormProvider>
  );
};
export default EventCreation;
