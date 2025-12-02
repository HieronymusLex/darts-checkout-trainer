import { describe, it, expect } from "vitest";
import {
  calculateDoubleDistribution,
  formatDoubleDistribution,
} from "./doubleDistribution";

describe("calculateDoubleDistribution", () => {
  it("should calculate distribution for 2-dart checkouts", () => {
    const distribution = calculateDoubleDistribution(2);

    expect(distribution.length).toBeGreaterThan(0);
    expect(distribution.every((d) => d.count > 0)).toBe(true);
    expect(distribution.every((d) => d.percentage > 0)).toBe(true);

    const totalPercentage = distribution.reduce(
      (sum, d) => sum + d.percentage,
      0
    );
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  it("should calculate distribution for 3-dart checkouts", () => {
    const distribution = calculateDoubleDistribution(3);

    expect(distribution.length).toBeGreaterThan(0);
    expect(distribution.every((d) => d.count > 0)).toBe(true);
    expect(distribution.every((d) => d.percentage > 0)).toBe(true);

    const totalPercentage = distribution.reduce(
      (sum, d) => sum + d.percentage,
      0
    );
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  it("should sort results by frequency descending", () => {
    const distribution = calculateDoubleDistribution(2);

    for (let i = 0; i < distribution.length - 1; i++) {
      expect(distribution[i].count).toBeGreaterThanOrEqual(
        distribution[i + 1].count
      );
    }
  });

  it("should include custom routes in calculation", () => {
    const customRoutes = {
      "100-2": ["T20", "D20"],
      "50-2": ["S10", "D20"],
    };

    const distribution = calculateDoubleDistribution(2, customRoutes);

    expect(distribution.length).toBeGreaterThan(0);
    const d20Entry = distribution.find((d) => d.double === "D20");
    expect(d20Entry).toBeDefined();
  });

  it("should handle BULL as a double", () => {
    const distribution = calculateDoubleDistribution(3);

    const bullEntry = distribution.find((d) => d.double === "BULL");
    expect(bullEntry).toBeDefined();
    if (bullEntry) {
      expect(bullEntry.count).toBeGreaterThan(0);
    }
  });
});

describe("formatDoubleDistribution", () => {
  it("should format distribution entry correctly", () => {
    const entry = {
      double: "D20",
      count: 45,
      total: 169,
      percentage: 26.627218934911243,
    };

    const formatted = formatDoubleDistribution(entry);
    expect(formatted).toBe("D20: 45/169 (26.6%)");
  });

  it("should format BULL correctly", () => {
    const entry = {
      double: "BULL",
      count: 10,
      total: 169,
      percentage: 5.917159763313609,
    };

    const formatted = formatDoubleDistribution(entry);
    expect(formatted).toBe("BULL: 10/169 (5.9%)");
  });
});
