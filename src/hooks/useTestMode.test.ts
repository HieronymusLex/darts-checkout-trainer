import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTestMode } from "./useTestMode";
import type { DartScore } from "@/utils/darts";

const mockGetRoute = (score: number, dartsInHand: 1 | 2 | 3): DartScore[] => {
  if (score === 100 && dartsInHand === 3) {
    return ["T20", "D20"];
  }
  if (score === 100 && dartsInHand === 2) {
    return ["T20", "D20"];
  }
  if (score === 100 && dartsInHand === 1) {
    return ["D20"];
  }
  if (score === 50 && dartsInHand === 1) {
    return ["BULL"];
  }
  if (score === 40 && dartsInHand === 1) {
    return ["D20"];
  }
  return ["D20"];
};

describe("useTestMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with a random question", () => {
    const { result } = renderHook(() => useTestMode(mockGetRoute));

    expect(result.current.currentQuestion).toBeDefined();
    expect(result.current.currentQuestion.score).toBeGreaterThanOrEqual(2);
    expect(result.current.currentQuestion.score).toBeLessThanOrEqual(170);
    expect([1, 2, 3]).toContain(result.current.currentQuestion.dartsInHand);
  });

  it("should validate correct answers", () => {
    const customGetRoute = vi.fn((score: number, dartsInHand: 1 | 2 | 3) => {
      if (score === 100 && dartsInHand === 2) {
        return ["T20", "D20"];
      }
      return mockGetRoute(score, dartsInHand);
    });

    const { result } = renderHook(() => useTestMode(customGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 100, max: 100 }],
        dartsInHand: [2],
      });
    });

    const isCorrect = result.current.checkAnswer(["T20", "D20"]);
    expect(isCorrect).toBe(true);
  });

  it("should reject incorrect answers with wrong notation", () => {
    const customGetRoute = vi.fn((score: number, dartsInHand: 1 | 2 | 3) => {
      if (score === 100 && dartsInHand === 2) {
        return ["T20", "D20"];
      }
      return mockGetRoute(score, dartsInHand);
    });

    const { result } = renderHook(() => useTestMode(customGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 100, max: 100 }],
        dartsInHand: [2],
      });
    });

    const isCorrect = result.current.checkAnswer(["T19", "D20"]);
    expect(isCorrect).toBe(false);
  });

  it("should reject answers with wrong number of darts", () => {
    const customGetRoute = vi.fn((score: number, dartsInHand: 1 | 2 | 3) => {
      if (score === 100 && dartsInHand === 2) {
        return ["T20", "D20"];
      }
      return mockGetRoute(score, dartsInHand);
    });

    const { result } = renderHook(() => useTestMode(customGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 100, max: 100 }],
        dartsInHand: [2],
      });
    });

    const isCorrect = result.current.checkAnswer(["T20", "S20", "D10"]);
    expect(isCorrect).toBe(false);
  });

  it("should generate a new question when nextQuestion is called", () => {
    const { result } = renderHook(() => useTestMode(mockGetRoute));

    const firstQuestion = result.current.currentQuestion;

    act(() => {
      result.current.nextQuestion();
    });

    const secondQuestion = result.current.currentQuestion;

    expect(secondQuestion).toBeDefined();
    expect(
      firstQuestion.score !== secondQuestion.score ||
        firstQuestion.dartsInHand !== secondQuestion.dartsInHand
    ).toBe(true);
  });

  it("should persist config to localStorage", () => {
    const { result } = renderHook(() => useTestMode(mockGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 2, max: 50 }],
        dartsInHand: [1, 2],
      });
    });

    const stored = localStorage.getItem("darts-checkout-test-mode-config");
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.scoreRanges).toEqual([{ min: 2, max: 50 }]);
    expect(parsed.dartsInHand).toEqual([1, 2]);
  });

  it("should filter questions by score range", () => {
    const { result } = renderHook(() => useTestMode(mockGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 2, max: 50 }],
        dartsInHand: [1, 2, 3],
      });
    });

    expect(result.current.currentQuestion.score).toBeGreaterThanOrEqual(2);
    expect(result.current.currentQuestion.score).toBeLessThanOrEqual(50);
  });

  it("should filter questions by darts in hand", () => {
    const { result } = renderHook(() => useTestMode(mockGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 2, max: 170 }],
        dartsInHand: [3],
      });
    });

    expect(result.current.currentQuestion.dartsInHand).toBe(3);
  });

  it("should load config from localStorage on initialization", () => {
    const testConfig = {
      scoreRanges: [{ min: 51, max: 100 }],
      dartsInHand: [2, 3] as (1 | 2 | 3)[],
    };

    localStorage.setItem(
      "darts-checkout-test-mode-config",
      JSON.stringify(testConfig)
    );

    const { result } = renderHook(() => useTestMode(mockGetRoute));

    expect(result.current.config).toEqual(testConfig);
  });

  it("should handle case-insensitive answer validation", () => {
    const customGetRoute = vi.fn((score: number, dartsInHand: 1 | 2 | 3) => {
      if (score === 100 && dartsInHand === 2) {
        return ["T20", "D20"];
      }
      return mockGetRoute(score, dartsInHand);
    });

    const { result } = renderHook(() => useTestMode(customGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 100, max: 100 }],
        dartsInHand: [2],
      });
    });

    const isCorrect = result.current.checkAnswer(["t20", "d20"]);
    expect(isCorrect).toBe(true);
  });

  it("should provide the correct route for the current question", () => {
    const customGetRoute = vi.fn((score: number, dartsInHand: 1 | 2 | 3) => {
      if (score === 50 && dartsInHand === 1) {
        return ["BULL"];
      }
      return mockGetRoute(score, dartsInHand);
    });

    const { result } = renderHook(() => useTestMode(customGetRoute));

    act(() => {
      result.current.updateConfig({
        scoreRanges: [{ min: 50, max: 50 }],
        dartsInHand: [1],
      });
    });

    expect(result.current.correctRoute).toEqual(["BULL"]);
  });
});
