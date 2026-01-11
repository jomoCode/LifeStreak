import { Task, TimeWindow } from "@/types";
import { TaskOccurrence } from "../streakEngine";
import { PUNCTUALITY_SCORES } from "./helpers";
import {
  GlobalAdherenceSummary,
  OccurrenceAdherenceResult,
  PunctualityBucket,
  TaskAdherenceSummary,
} from "./types";

/**
 * Determines punctuality category for a checked occurrence.
 */
export const classifyPunctuality = (
  checkedAt: number | undefined,
  date: string,
  timeWindow: TimeWindow
): PunctualityBucket => {
  if (!checkedAt) return "missed";

  const start = new Date(`${date}T${timeWindow.start}`);
  const end = new Date(`${date}T${timeWindow.end}`);
  const checkTime = new Date(checkedAt);

  const totalDayMs = 24 * 60 * 60 * 1000;
  const eventWindowMs = end.getTime() - start.getTime();
  const unTaskedMs = totalDayMs - eventWindowMs;
  const threshold = unTaskedMs / 2;

  if (checkTime >= start && checkTime <= end) {
    return "on-time";
  }

  if (checkTime < start) {
    const diff = start.getTime() - checkTime.getTime();
    return diff > threshold ? "very-early" : "early";
  }

  const diff = checkTime.getTime() - end.getTime();
  return diff > threshold ? "very-late" : "late";
};

export const evaluateOccurrence = (
  task: Task,
  occurrence: TaskOccurrence
): OccurrenceAdherenceResult => {
  const punctuality =
    occurrence.status === "checked"
      ? classifyPunctuality(
          occurrence.checkedAt,
          occurrence.date,
          task.timeWindow
        )
      : "missed";

  return {
    occurrenceId: occurrence.id,
    taskId: task.id,
    date: occurrence.date,

    status: occurrence.status === "checked" ? "checked" : "missed",
    punctuality,
    score: PUNCTUALITY_SCORES[punctuality],
  };
};

export const summarizeTaskAdherence = (
  task: Task,
  occurrences: TaskOccurrence[]
): TaskAdherenceSummary => {
  const evaluated = occurrences.map((o) => evaluateOccurrence(task, o));

  const total = evaluated.length;
  const checked = evaluated.filter((e) => e.status === "checked").length;

  const punctualityTotal = evaluated.reduce((sum, e) => sum + e.score, 0);

  const breakdown = evaluated.reduce((acc, e) => {
    acc[e.punctuality] = (acc[e.punctuality] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    taskId: task.id,

    totalOccurrences: total,
    checkedOccurrences: checked,

    adherencePercentage: total === 0 ? 0 : (checked / total) * 100,

    punctualityScoreTotal: punctualityTotal,
    punctualityPercentage: total === 0 ? 0 : punctualityTotal / (total * 100),

    breakdown,
  };
};

export const summarizeGlobalAdherence = (
  tasks: Task[],
  occurrencesByTask: Record<string, TaskOccurrence[]>
): GlobalAdherenceSummary => {
  const summaries = tasks.map((task) =>
    summarizeTaskAdherence(task, occurrencesByTask[task.id] ?? [])
  );

  const totalOccurrences = summaries.reduce(
    (sum, s) => sum + s.totalOccurrences,
    0
  );

  const totalChecked = summaries.reduce(
    (sum, s) => sum + s.checkedOccurrences,
    0
  );

  const punctualityTotal = summaries.reduce(
    (sum, s) => sum + s.punctualityScoreTotal,
    0
  );

  return {
    totalOccurrences,
    totalChecked,

    adherencePercentage:
      totalOccurrences === 0 ? 0 : (totalChecked / totalOccurrences) * 100,

    punctualityScoreTotal: punctualityTotal,
    punctualityPercentage:
      totalOccurrences === 0 ? 0 : punctualityTotal / (totalOccurrences * 100),
  };
};
