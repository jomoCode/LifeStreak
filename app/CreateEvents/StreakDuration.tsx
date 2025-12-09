import CreateEvent from "@/components/ui/Template/CreateEvent";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";

export default function DurationScreen() {
  const streak = useStreakForm();
  const router = useRouter();

  return (
    <CreateEvent
      title="How long is your streak?"
      placeholder=""
      fieldType="number"
      value={streak.form.duration}
      onChange={(d) => {
        if (typeof d !== "number") {
          throw new Error("Invalid value type");
        }
        streak.setDuration(d);
      }}
      onPrev={() => {
        router.back();
      }}
      onNext={() => {
        router.push("/CreateEvents/StreakInterval");
      }}
    />
  );
}
