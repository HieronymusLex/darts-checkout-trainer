export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateScore = (score: number): ValidationResult => {
  if (!Number.isInteger(score)) {
    return {
      valid: false,
      error: "Score must be a whole number",
    };
  }

  if (score === 1) {
    return {
      valid: false,
      error: "Score of 1 is impossible to checkout",
    };
  }

  if (score < 2) {
    return {
      valid: false,
      error: "Score must be at least 2",
    };
  }

  if (score > 170) {
    return {
      valid: false,
      error: "Score above 170 is impossible to checkout with 3 darts",
    };
  }

  return { valid: true };
};

export const validateScoreInput = (input: string): ValidationResult => {
  const trimmed = input.trim();

  if (trimmed === "") {
    return {
      valid: false,
      error: "Score is required",
    };
  }

  const parsed = Number(trimmed);

  if (isNaN(parsed)) {
    return {
      valid: false,
      error: "Score must be a valid number",
    };
  }

  return validateScore(parsed);
};
