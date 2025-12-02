export const SCORE_RANGES = [
  { min: 2, max: 50 },
  { min: 51, max: 100 },
  { min: 101, max: 170 },
] as const;

export const DARTS_OPTIONS = [1, 2, 3] as const;

export const DARTBOARD_SCORES = [
  20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
] as const;

export const MIN_SCORE = 2;
export const MAX_SCORE = 170;

export const FEEDBACK_MESSAGES = {
  CORRECT: "Correct! Well done!",
  INCORRECT: (correctRoute: string) =>
    `Incorrect. The correct route is: ${correctRoute}`,
} as const;
