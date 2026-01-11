export interface Task {
  id: string;
  name: string;
  schedule: Schedule;
  startDate: Date;
  endDate?: Date;
  totalDays?: number;
  timeWindow: TimeWindow;
  status: "active" | "paused" | "completed" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}


export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Schedule =
  | { type: "daily" }              // repeats every day
  | { type: "custom"; days: Weekday[] }; // repeats only on selected days

export type TimeWindow = {
  start: string; // "06:00"
  end: string;   // "07:00"
};

