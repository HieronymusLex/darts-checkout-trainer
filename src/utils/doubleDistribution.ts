import type { DartScore } from "./darts";
import { DEFAULT_ROUTES } from "@/data/defaultRoutes";

export interface DoubleDistribution {
  double: string;
  count: number;
  total: number;
  percentage: number;
}

const extractDouble = (route: DartScore[]): string | null => {
  if (route.length === 0) return null;

  const lastDart = route[route.length - 1].toUpperCase();

  if (lastDart === "BULL" || lastDart === "D25") {
    return "BULL";
  }

  if (lastDart.startsWith("D")) {
    return lastDart;
  }

  return null;
};

export const calculateDoubleDistribution = (
  dartsInHand: 2 | 3,
  customRoutes: Record<string, DartScore[]> = {}
): DoubleDistribution[] => {
  const doubleCounts = new Map<string, number>();
  let totalCheckouts = 0;

  const routeKey = dartsInHand === 2 ? "twoDarts" : "threeDarts";

  Object.entries(DEFAULT_ROUTES).forEach(([scoreStr, routes]) => {
    const score = parseInt(scoreStr, 10);
    const customKey = `${score}-${dartsInHand}`;
    const route = customRoutes[customKey] || routes[routeKey];

    const double = extractDouble(route);
    if (double) {
      doubleCounts.set(double, (doubleCounts.get(double) || 0) + 1);
      totalCheckouts++;
    }
  });

  const distribution: DoubleDistribution[] = Array.from(
    doubleCounts.entries()
  ).map(([double, count]) => ({
    double,
    count,
    total: totalCheckouts,
    percentage: (count / totalCheckouts) * 100,
  }));

  distribution.sort((a, b) => b.count - a.count);

  return distribution;
};

export const calculateCombinedDoubleDistribution = (
  customRoutes2Dart: Record<string, DartScore[]> = {},
  customRoutes3Dart: Record<string, DartScore[]> = {}
): DoubleDistribution[] => {
  const doubleCounts = new Map<string, number>();
  let totalCheckouts = 0;

  [2, 3].forEach((dartsInHand) => {
    const routeKey = dartsInHand === 2 ? "twoDarts" : "threeDarts";
    const customRoutes =
      dartsInHand === 2 ? customRoutes2Dart : customRoutes3Dart;

    Object.entries(DEFAULT_ROUTES).forEach(([scoreStr, routes]) => {
      const score = parseInt(scoreStr, 10);
      const customKey = `${score}-${dartsInHand}`;
      const route = customRoutes[customKey] || routes[routeKey];

      const double = extractDouble(route);
      if (double) {
        doubleCounts.set(double, (doubleCounts.get(double) || 0) + 1);
        totalCheckouts++;
      }
    });
  });

  const distribution: DoubleDistribution[] = Array.from(
    doubleCounts.entries()
  ).map(([double, count]) => ({
    double,
    count,
    total: totalCheckouts,
    percentage: (count / totalCheckouts) * 100,
  }));

  distribution.sort((a, b) => b.count - a.count);

  return distribution;
};

export const formatDoubleDistribution = (
  distribution: DoubleDistribution
): string => {
  return `${distribution.double}: ${distribution.count}/${
    distribution.total
  } (${distribution.percentage.toFixed(1)}%)`;
};
