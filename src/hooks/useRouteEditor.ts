import { useState } from "react";
import type { DartScore } from "@/utils/darts";

interface EditingRoute {
  score: number;
  dartsInHand: 1 | 2 | 3;
  route: DartScore[];
}

export const useRouteEditor = (
  updateRoute: (
    score: number,
    dartsInHand: 1 | 2 | 3,
    route: DartScore[]
  ) => void,
  resetRoute: (score: number, dartsInHand: 1 | 2 | 3) => void
) => {
  const [editingRoute, setEditingRoute] = useState<EditingRoute | null>(null);

  const startEdit = (
    score: number,
    dartsInHand: 1 | 2 | 3,
    route: DartScore[]
  ) => {
    setEditingRoute({ score, dartsInHand, route });
  };

  const saveEdit = (newRoute: DartScore[]) => {
    if (editingRoute) {
      updateRoute(editingRoute.score, editingRoute.dartsInHand, newRoute);
      setEditingRoute(null);
    }
  };

  const resetEdit = () => {
    if (editingRoute) {
      resetRoute(editingRoute.score, editingRoute.dartsInHand);
      setEditingRoute(null);
    }
  };

  const cancelEdit = () => {
    setEditingRoute(null);
  };

  return {
    editingRoute,
    startEdit,
    saveEdit,
    resetEdit,
    cancelEdit,
  };
};
