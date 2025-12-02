import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTestMode } from "./useTestMode";
import { useCheckoutRoutes } from "./useCheckoutRoutes";

describe("useTestMode integration with useCheckoutRoutes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should work with real checkout routes", () => {
    const { result: checkoutResult } = renderHook(() => useCheckoutRoutes());

    const getRouteWrapper = (score: number, dartsInHand: 1 | 2 | 3) => {
      return checkoutResult.current.getRoute(score, dartsInHand).route;
    };

    const { result: testResult } = renderHook(() =>
      useTestMode(getRouteWrapper)
    );

    expect(testResult.current.currentQuestion).toBeDefined();
    expect(testResult.current.correctRoute).toBeDefined();
    expect(testResult.current.correctRoute.length).toBeGreaterThan(0);
  });

  it("should validate answers against real routes", () => {
    const { result: checkoutResult } = renderHook(() => useCheckoutRoutes());

    const getRouteWrapper = (score: number, dartsInHand: 1 | 2 | 3) => {
      return checkoutResult.current.getRoute(score, dartsInHand).route;
    };

    const { result: testResult } = renderHook(() =>
      useTestMode(getRouteWrapper)
    );

    act(() => {
      testResult.current.updateConfig({
        scoreRanges: [{ min: 40, max: 40 }],
        dartsInHand: [1],
      });
    });

    const correctAnswer = testResult.current.correctRoute;
    const isCorrect = testResult.current.checkAnswer(correctAnswer);

    expect(isCorrect).toBe(true);
  });

  it("should work with custom routes", () => {
    const { result: checkoutResult } = renderHook(() => useCheckoutRoutes());

    act(() => {
      checkoutResult.current.updateRoute(100, 2, ["T18", "T18", "D13"]);
    });

    const getRouteWrapper = (score: number, dartsInHand: 1 | 2 | 3) => {
      return checkoutResult.current.getRoute(score, dartsInHand).route;
    };

    const { result: testResult } = renderHook(() =>
      useTestMode(getRouteWrapper)
    );

    act(() => {
      testResult.current.updateConfig({
        scoreRanges: [{ min: 100, max: 100 }],
        dartsInHand: [2],
      });
    });

    expect(testResult.current.correctRoute).toEqual(["T18", "T18", "D13"]);

    const isCorrect = testResult.current.checkAnswer(["T18", "T18", "D13"]);
    expect(isCorrect).toBe(true);
  });
});
