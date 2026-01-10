// useOccurrences.ts

import { useEffect, useState } from "react";
import { initDBAsync } from "@/lib/database/initializeDb";
import { TaskOccurrence } from "@/lib/streakEngine";
import { readOccurrencesByTaskAsync } from "@/lib/database/databaseHandlers";

/**
 * Fetches all occurrences for a single task.
 * This keeps occurrences out of the Task context.
 */
export const useOccurrences = (taskId: string) => {
  const [occurrences, setOccurrences] = useState<TaskOccurrence[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const load = async () => {
      setLoading(true);
      try {
        const db = await initDBAsync();
        const rows = await readOccurrencesByTaskAsync(db, taskId);
        setOccurrences(rows);
      } catch (e) {
        console.error("Failed to load occurrences", e);
        setOccurrences([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [taskId]);

  return { occurrences, loading };
};
