import { ReactNode, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type CreateStreakFormProps = {
  interval: number;
  duration: number;
  noOfTimes: number;
  eventName: string;
  startDate: string;
  startTime: string;
};
type CreateStreakFormKids = { children: ReactNode };

export const CreateStreakForm = ({ children }: CreateStreakFormKids) => {
  const methods = useForm<CreateStreakFormProps>({
    defaultValues: {
      duration: 0,
      eventName: "",
      interval: 0,
      noOfTimes: 0,
      startDate: "",
      startTime: "",
    },
  });

  useEffect(() => {
    const eventName = methods.watch("eventName");
    console.log("Event Name Changed:", eventName);
  }, [methods]);
  return <FormProvider {...methods}>{children}</FormProvider>;
};
