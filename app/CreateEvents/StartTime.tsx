import CreateEvent from "@/components/ui/Template/CreateEvent";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";

export default function StartTimeScreen() {
  const streak = useStreakForm();
  const router = useRouter();

  return (
    <CreateEvent
      title="Start Time"
      fieldType="time"
      value={
        streak.form.startTime
          ? new Date(`1970-01-01T${streak.form.startTime}:00`)
          : new Date()
      }
      onChange={(d) => {
        if (!(d instanceof Date)) throw new Error("Invalid time value");
        streak.setStartTime(d);
      }}
      onPrev={() => router.back()}
      onNext={() => router.push("/CreateEvents/StreakInterval")}
    />
  );
}
