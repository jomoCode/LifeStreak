import CreateEvent from "@/components/ui/Template/CreateEvent";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";

export default function TimesPerDayScreen() {
  const streak = useStreakForm();
  const router = useRouter();

  return (
    <CreateEvent
      title="Times Per Day"
      placeholder="Enter number of times per day"
      fieldType="number"
      value={streak.form.timesPerDay}
      onChange={(v) => streak.setTimesPerDay(Number(v))}
      onPrev={() => router.back()}
      onNext={() => router.push("/CreateEvents/Review")}
    />
  );
}
