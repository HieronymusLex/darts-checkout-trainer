import { describe, it, expect } from "vitest";
import { validateScore, validateScoreInput } from "./validators";

describe("validateScore", () => {
  it("should accept valid scores between 2 and 170", () => {
    expect(validateScore(2).valid).toBe(true);
    expect(validateScore(50).valid).toBe(true);
    expect(validateScore(100).valid).toBe(true);
    expect(validateScore(170).valid).toBe(true);
  });

  it("should reject score of 1", () => {
    const result = validateScore(1);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score of 1 is impossible to checkout");
  });

  it("should reject scores above 170", () => {
    const result = validateScore(171);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      "Score above 170 is impossible to checkout with 3 darts"
    );
  });

  it("should reject scores below 2", () => {
    const result = validateScore(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score must be at least 2");
  });

  it("should reject non-integer scores", () => {
    const result = validateScore(50.5);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score must be a whole number");
  });
});

describe("validateScoreInput", () => {
  it("should accept valid numeric strings", () => {
    expect(validateScoreInput("50").valid).toBe(true);
    expect(validateScoreInput("100").valid).toBe(true);
    expect(validateScoreInput("170").valid).toBe(true);
  });

  it("should reject empty input", () => {
    const result = validateScoreInput("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score is required");
  });

  it("should reject non-numeric input", () => {
    const result = validateScoreInput("abc");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score must be a valid number");
  });

  it("should handle whitespace", () => {
    expect(validateScoreInput("  50  ").valid).toBe(true);
  });

  it("should reject invalid scores", () => {
    const result = validateScoreInput("1");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Score of 1 is impossible to checkout");
  });
});
