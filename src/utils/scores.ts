import { MIN_SCORE, MAX_SCORE } from "@/constants";

export const generateScoreRange = (
  min: number = MIN_SCORE,
  max: number = MAX_SCORE
): number[] => {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
};
