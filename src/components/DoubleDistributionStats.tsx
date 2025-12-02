import { useMemo, useState } from "react";
import { useCheckoutRoutes } from "@/hooks/useCheckoutRoutes";
import { useRouteEditor } from "@/hooks/useRouteEditor";
import {
  calculateDoubleDistribution,
  calculateCombinedDoubleDistribution,
  formatDoubleDistribution,
} from "@/utils/doubleDistribution";
import { CheckoutDisplay } from "./CheckoutDisplay";
import { RouteEditor } from "./RouteEditor";
import { Button } from "./Button";
import { Drawer } from "./Drawer";
import { ScoreGrid } from "./ScoreGrid";
import type { DartScore } from "@/utils/darts";

interface DoubleDistributionStatsProps {
  dartsInHand: 2 | 3 | "combined";
}

export const DoubleDistributionStats = ({
  dartsInHand,
}: DoubleDistributionStatsProps) => {
  const { getRoute, updateRoute, resetRoute } = useCheckoutRoutes();
  const { editingRoute, startEdit, saveEdit, resetEdit, cancelEdit } =
    useRouteEditor(updateRoute, resetRoute);
  const [selectedDouble, setSelectedDouble] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const customRoutes2Dart = useMemo(() => {
    const routes: Record<string, string[]> = {};
    for (let score = 2; score <= 170; score++) {
      const route = getRoute(score, 2);
      if (route.isCustom) {
        routes[`${score}-2`] = route.route;
      }
    }
    return routes;
  }, [getRoute]);

  const customRoutes3Dart = useMemo(() => {
    const routes: Record<string, string[]> = {};
    for (let score = 2; score <= 170; score++) {
      const route = getRoute(score, 3);
      if (route.isCustom) {
        routes[`${score}-3`] = route.route;
      }
    }
    return routes;
  }, [getRoute]);

  const distribution = useMemo(() => {
    if (dartsInHand === "combined") {
      return calculateCombinedDoubleDistribution(
        customRoutes2Dart,
        customRoutes3Dart
      );
    }
    const customRoutes =
      dartsInHand === 2 ? customRoutes2Dart : customRoutes3Dart;
    return calculateDoubleDistribution(dartsInHand, customRoutes);
  }, [dartsInHand, customRoutes2Dart, customRoutes3Dart]);

  const scoresForDouble = useMemo(() => {
    const scoreMap = new Map<
      string,
      { threeDart: number[]; twoDart: number[] }
    >();

    const extractDouble = (route: DartScore[]): string | null => {
      if (route.length === 0) return null;
      const lastDart = route[route.length - 1].toUpperCase();
      if (lastDart === "BULL" || lastDart === "D25") return "BULL";
      if (lastDart.startsWith("D")) return lastDart;
      return null;
    };

    if (dartsInHand === "combined") {
      for (let score = 2; score <= 170; score++) {
        const route3 = getRoute(score, 3).route;
        const double3 = extractDouble(route3);
        if (double3) {
          const entry = scoreMap.get(double3) || { threeDart: [], twoDart: [] };
          if (!entry.threeDart.includes(score)) {
            entry.threeDart.push(score);
          }
          scoreMap.set(double3, entry);
        }

        const route2 = getRoute(score, 2).route;
        const double2 = extractDouble(route2);
        if (double2) {
          const entry = scoreMap.get(double2) || { threeDart: [], twoDart: [] };
          if (!entry.twoDart.includes(score)) {
            entry.twoDart.push(score);
          }
          scoreMap.set(double2, entry);
        }
      }

      scoreMap.forEach((entry) => {
        entry.threeDart.sort((a, b) => a - b);
        entry.twoDart.sort((a, b) => a - b);
      });
    } else {
      for (let score = 2; score <= 170; score++) {
        const route = getRoute(score, dartsInHand).route;
        const double = extractDouble(route);
        if (double) {
          const entry = scoreMap.get(double) || { threeDart: [], twoDart: [] };
          if (dartsInHand === 3) {
            entry.threeDart.push(score);
          } else {
            entry.twoDart.push(score);
          }
          scoreMap.set(double, entry);
        }
      }

      scoreMap.forEach((entry) => {
        entry.threeDart.sort((a, b) => a - b);
        entry.twoDart.sort((a, b) => a - b);
      });
    }

    return scoreMap;
  }, [dartsInHand, getRoute]);

  const title =
    dartsInHand === "combined"
      ? "Combined (2-Dart & 3-Dart)"
      : dartsInHand === 2
      ? "2-Dart"
      : "3-Dart";

  const handleDoubleClick = (double: string) => {
    if (selectedDouble === double) {
      setSelectedDouble(null);
      setSelectedScore(null);
    } else {
      setSelectedDouble(double);
      setSelectedScore(null);
    }
  };

  const handleScoreClick = (score: number) => {
    setSelectedScore(selectedScore === score ? null : score);
  };

  const selectedScoreData = selectedDouble
    ? scoresForDouble.get(selectedDouble)
    : null;

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-2">
        Double Distribution ({title} Checkouts)
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        This shows which doubles you'll need to practice based on your current
        checkout routes. Click a double to see all checkouts that use it.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {distribution.map((entry) => (
          <Button
            key={entry.double}
            onClick={() => handleDoubleClick(entry.double)}
            variant="secondary"
            active={selectedDouble === entry.double}
            className="text-sm text-left"
          >
            {formatDoubleDistribution(entry)}
          </Button>
        ))}
      </div>

      {selectedDouble && selectedScoreData && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-4">
            Checkouts using {selectedDouble}
          </h4>

          {dartsInHand === "combined" ? (
            <>
              {selectedScoreData.threeDart.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-md font-semibold text-gray-300 mb-3">
                    3-Dart Finishes ({selectedScoreData.threeDart.length})
                  </h5>
                  <ScoreGrid
                    selectedScore={selectedScore}
                    onScoreClick={handleScoreClick}
                    scores={selectedScoreData.threeDart}
                  />
                </div>
              )}

              {selectedScoreData.twoDart.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-md font-semibold text-gray-300 mb-3">
                    2-Dart Finishes ({selectedScoreData.twoDart.length})
                  </h5>
                  <ScoreGrid
                    selectedScore={selectedScore}
                    onScoreClick={handleScoreClick}
                    scores={selectedScoreData.twoDart}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="mb-6">
              <h5 className="text-md font-semibold text-gray-300 mb-3">
                {dartsInHand === 3 ? "3-Dart" : "2-Dart"} Finishes (
                {dartsInHand === 3
                  ? selectedScoreData.threeDart.length
                  : selectedScoreData.twoDart.length}
                )
              </h5>
              <ScoreGrid
                selectedScore={selectedScore}
                onScoreClick={handleScoreClick}
                scores={
                  dartsInHand === 3
                    ? selectedScoreData.threeDart
                    : selectedScoreData.twoDart
                }
              />
            </div>
          )}
        </div>
      )}

      <Drawer
        isOpen={selectedScore !== null}
        onClose={() => setSelectedScore(null)}
        title={`Checkout Routes for ${selectedScore}`}
      >
        {selectedScore !== null && (
          <div className="space-y-1.5">
            {dartsInHand === "combined" ? (
              <>
                <CheckoutDisplay
                  score={selectedScore}
                  dartsInHand={3}
                  route={getRoute(selectedScore, 3).route}
                  isCustom={getRoute(selectedScore, 3).isCustom}
                  onEdit={(route) => startEdit(selectedScore, 3, route)}
                />
                <CheckoutDisplay
                  score={selectedScore}
                  dartsInHand={2}
                  route={getRoute(selectedScore, 2).route}
                  isCustom={getRoute(selectedScore, 2).isCustom}
                  onEdit={(route) => startEdit(selectedScore, 2, route)}
                />
              </>
            ) : (
              <CheckoutDisplay
                score={selectedScore}
                dartsInHand={dartsInHand}
                route={getRoute(selectedScore, dartsInHand).route}
                isCustom={getRoute(selectedScore, dartsInHand).isCustom}
                onEdit={(route) => startEdit(selectedScore, dartsInHand, route)}
              />
            )}
          </div>
        )}
      </Drawer>

      {editingRoute && (
        <RouteEditor
          score={editingRoute.score}
          dartsInHand={editingRoute.dartsInHand}
          currentRoute={editingRoute.route}
          onSave={saveEdit}
          onCancel={cancelEdit}
          onReset={resetEdit}
        />
      )}
    </div>
  );
};
