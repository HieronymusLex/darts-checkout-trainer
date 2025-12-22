import { describe, it, expect } from "vitest";
import { DEFAULT_ROUTES } from "./defaultRoutes";
import { convertNotationToValue } from "@/utils/darts";

describe("DEFAULT_ROUTES validation", () => {
  const calculateRouteScore = (darts: string[]): number => {
    return darts.reduce((total, dart) => total + convertNotationToValue(dart), 0);
  };

  const endsWithDouble = (darts: string[]): boolean => {
    if (darts.length === 0) return false;
    const lastDart = darts[darts.length - 1].toUpperCase();
    return lastDart.startsWith("D") || lastDart === "BULL";
  };

  const isValidCheckout = (darts: string[], targetScore: number): boolean => {
    if (darts.length === 0) return false;
    const totalScore = calculateRouteScore(darts);
    const endsWithDoubleOrBull = endsWithDouble(darts);
    return totalScore === targetScore && endsWithDoubleOrBull;
  };

  describe("2-98 and 100: two and three dart finishes", () => {
    const scores = [...Array.from({ length: 97 }, (_, i) => i + 2), 100];

    it.each(scores)("should have valid two dart finish for %d", (score) => {
      const route = DEFAULT_ROUTES[score];
      if (route && route.twoDarts.length > 0) {
        console.log("two", route)
        expect(isValidCheckout(route.twoDarts, score)).toBe(true);
      }
    });

    it.each(scores)("should have valid three dart finish for %d", (score) => {
      const route = DEFAULT_ROUTES[score];
      if (route && route.threeDarts.length > 0) {
        console.log("three", route)
        expect(isValidCheckout(route.twoDarts, score)).toBe(true);
      }
    });
  });

  describe("101-158, 160, 161, 164, 167, 170: three dart finishes", () => {
    const scores = [
      ...Array.from({ length: 58 }, (_, i) => i + 101), // 101-158
      160, 161, 164, 167, 170
    ];

    it.each(scores)("should have valid three dart finish for %d", (score) => {
      const route = DEFAULT_ROUTES[score];
      if (route.threeDarts.length > 0) {
        expect(isValidCheckout(route.threeDarts, score)).toBe(true);
      }
    });
  });
});