import { CreateEvent } from "@/lib/CRUDE_sqlite";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type CreateStreakFormProps = CreateEvent;
type CreateStreakFormKids = { children: ReactNode };

export const CreateStreakForm = ({ children }: CreateStreakFormKids) => {
  const methods = useForm<CreateStreakFormProps>({});
  return <FormProvider {...methods}>{children}</FormProvider>;
};
