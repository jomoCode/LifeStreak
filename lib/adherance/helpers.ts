import { PunctualityBucket } from "./types";

/**
 * Numerical score assigned to punctuality buckets.
 * This allows future tuning without changing logic.
 */
export const PUNCTUALITY_SCORES: Record<PunctualityBucket, number> = {
  "very-early": -60,
  "early": -50,
  "on-time": 100,
  "late": 60,
  "very-late": 50,
  "missed": 0,
};
