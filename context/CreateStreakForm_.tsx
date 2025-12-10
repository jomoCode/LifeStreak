import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

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
  // const onSubmit: SubmitHandler<CreateStreakFormProps> = (data) =>
  //   console.log(data);

  return <FormProvider {...methods}>
    {children}</FormProvider>;
};
