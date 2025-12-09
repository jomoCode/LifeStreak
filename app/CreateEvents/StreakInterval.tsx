import CreateEvent from "@/components/ui/Template/CreateEvent";
import { useStreakForm } from "@/context/useCreateStreakForm";
import { useRouter } from "expo-router";

const IntervalScreen = () => {
  const streak = useStreakForm();
  const router = useRouter();

  const intervalOptions = [
    { label: "Every day", value: 1 },
    { label: "Every 2 days", value: 2 },
    { label: "Every 3 days", value: 3 },
    { label: "Every 4 days", value: 4 },
    { label: "Every 5 days", value: 5 },
    { label: "Every 6 days", value: 6 },
    { label: "Weekly", value: 7 },
  ];

  return (
    <CreateEvent
      title="Frequency"
      fieldType="select"
      value={streak.form.interval}
      options={intervalOptions}
      onChange={(v) => streak.setInterval(v as number)}
      onPrev={() => router.back()}
      onNext={() => router.push("/CreateEvents/TimesPerDay")}
    />
  );
}

export default IntervalScreen;