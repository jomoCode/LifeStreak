import { ReactNode } from "react";
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
      duration: -1,
      eventName: "",
      interval: -1,
      noOfTimes: -1,
      startDate: "",
      startTime: "",
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};
