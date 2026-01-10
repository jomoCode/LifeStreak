import { Schedule } from "@/types";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

type CreateEvent = {
  name: string;
  schedule: Schedule; 
  startDate: Date | number;
  endDate?: Date | number;
  totalDays?: number; // maximum 30
  startTime: string;
  endTime: string;
};


export type CreateStreakFormProps = CreateEvent;
type CreateStreakFormKids = { children: ReactNode };

export const CreateStreakForm = ({ children }: CreateStreakFormKids) => {
  const methods = useForm<CreateStreakFormProps>({});
  return <FormProvider {...methods}>{children}</FormProvider>;
};

