import { useState, useEffect, useCallback } from "react";
import type { DartScore } from "@/utils/darts";
import type { CheckoutData } from "@/utils/storage";
import {
  readFromLocalStorage,
  getRoute as getRouteFromStorage,
  isCustomRoute as isCustomRouteFromStorage,
  saveCustomRoute,
  resetToDefaultRoute,
} from "@/utils/storage";

export interface CheckoutRoute {
  score: number;
  dartsInHand: 1 | 2 | 3;
  route: DartScore[];
  isCustom: boolean;
}

interface UseCheckoutRoutesReturn {
  getRoute: (score: number, dartsInHand: 1 | 2 | 3) => CheckoutRoute;
  updateRoute: (
    score: number,
    dartsInHand: 1 | 2 | 3,
    route: DartScore[]
  ) => void;
  resetRoute: (score: number, dartsInHand: 1 | 2 | 3) => void;
  isCustomRoute: (score: number, dartsInHand: 1 | 2 | 3) => boolean;
  storageError: string | null;
}

export const useCheckoutRoutes = (): UseCheckoutRoutesReturn => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customRoutes: {},
  });
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const result = readFromLocalStorage();

    if (result.success && result.data) {
      setCheckoutData(result.data);
      setStorageError(null);
    } else {
      setStorageError(result.error || "Failed to load custom routes");
      setCheckoutData({ customRoutes: {} });
    }
  }, []);

  const getRoute = useCallback(
    (score: number, dartsInHand: 1 | 2 | 3): CheckoutRoute => {
      const route = getRouteFromStorage(
        score,
        dartsInHand,
        checkoutData.customRoutes
      );
      const isCustom = isCustomRouteFromStorage(
        score,
        dartsInHand,
        checkoutData.customRoutes
      );

      return {
        score,
        dartsInHand,
        route,
        isCustom,
      };
    },
    [checkoutData.customRoutes]
  );

  const updateRoute = useCallback(
    (score: number, dartsInHand: 1 | 2 | 3, route: DartScore[]) => {
      const result = saveCustomRoute(score, dartsInHand, route, checkoutData);

      if (result.success && result.data) {
        setCheckoutData(result.data);
        setStorageError(null);
      } else {
        setStorageError(
          result.error ||
            "Failed to save custom route. Changes will not persist."
        );
        setCheckoutData((prev) => ({
          customRoutes: {
            ...prev.customRoutes,
            [`${score}-${dartsInHand}`]: route,
          },
        }));
      }
    },
    [checkoutData]
  );

  const resetRoute = useCallback(
    (score: number, dartsInHand: 1 | 2 | 3) => {
      const result = resetToDefaultRoute(score, dartsInHand, checkoutData);

      if (result.success && result.data) {
        setCheckoutData(result.data);
        setStorageError(null);
      } else {
        setStorageError(
          result.error || "Failed to reset route. Changes will not persist."
        );
        const key = `${score}-${dartsInHand}`;
        const { [key]: _, ...remainingRoutes } = checkoutData.customRoutes;
        setCheckoutData({ customRoutes: remainingRoutes });
      }
    },
    [checkoutData]
  );

  const isCustomRoute = useCallback(
    (score: number, dartsInHand: 1 | 2 | 3): boolean => {
      return isCustomRouteFromStorage(
        score,
        dartsInHand,
        checkoutData.customRoutes
      );
    },
    [checkoutData.customRoutes]
  );

  return {
    getRoute,
    updateRoute,
    resetRoute,
    isCustomRoute,
    storageError,
  };
};
