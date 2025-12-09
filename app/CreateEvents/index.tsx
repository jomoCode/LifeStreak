import CreateEvent from "@/components/ui/Template/CreateEvent";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";

export default function GoalTitleScreen() {
  const streak = useStreakForm();
const router = useRouter();
  return (
    <CreateEvent
      title="Your Goal"
      placeholder="Enter goal title"
      fieldType="text"
      value={streak.form.goalTitle}
      onChange={(value) => {
        if (typeof value !== "string") {
          throw new Error("Invalid value type");
        }
        streak.setGoalTitle(value);
      }}
      onNext={() => {
    router.push("/CreateEvents/StartDate");
      
      }}
    />
  );
}
