/*------------------------------------------------------------------------------------------
--------------------------Adherance Engine--------------------------------------------------*/

export type PunctualityBucket =
  | "very-early"
  | "early"
  | "on-time"
  | "very-late"
  | "missed"
  | "late";

export type OccurrenceAdherenceResult = {
  occurrenceId: string;
  taskId: string;
  date: string;

  status: "checked" | "missed";
  punctuality: PunctualityBucket;

  score: number;
};

export type TaskAdherenceSummary = {
  taskId: string;

  totalOccurrences: number;
  checkedOccurrences: number;

  adherencePercentage: number;

  punctualityScoreTotal: number;
  punctualityPercentage: number;

  breakdown: Record<PunctualityBucket, number>;
};

export type GlobalAdherenceSummary = {
  totalOccurrences: number;
  totalChecked: number;

  adherencePercentage: number;

  punctualityScoreTotal: number;
  punctualityPercentage: number;
};
