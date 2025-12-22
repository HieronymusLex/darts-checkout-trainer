import type { DartScore, CheckoutRoutes } from "./darts";
import { DEFAULT_ROUTES } from "@/data/defaultRoutes";

const STORAGE_KEY = "darts-checkout-custom-routes";

export interface CheckoutData {
  customRoutes: {
    [key: string]: DartScore[];
  };
}

interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const createRouteKey = (score: number, dartsInHand: 1 | 2 | 3): string => {
  return `${score}-${dartsInHand}`;
};

export const readFromLocalStorage = (): StorageResult<CheckoutData> => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return {
        success: false,
        error: "localStorage is not available",
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        success: true,
        data: { customRoutes: {} },
      };
    }

    const parsed = JSON.parse(stored) as CheckoutData;

    if (!parsed.customRoutes || typeof parsed.customRoutes !== "object") {
      return {
        success: false,
        error: "Invalid data format in localStorage",
      };
    }

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to read from localStorage",
    };
  }
};

export const writeToLocalStorage = (
  data: CheckoutData
): StorageResult<void> => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return {
        success: false,
        error: "localStorage is not available",
      };
    }

    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);

    return {
      success: true,
    };
  } catch (error) {
    if (
      (error instanceof Error && error.name === "QuotaExceededError") ||
      (error instanceof DOMException && error.name === "QuotaExceededError")
    ) {
      return {
        success: false,
        error: "localStorage quota exceeded",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error || error instanceof DOMException
          ? error.message
          : "Failed to write to localStorage",
    };
  }
};

export const getRoute = (
  score: number,
  dartsInHand: 1 | 2 | 3,
  customRoutes: CheckoutData["customRoutes"]
): DartScore[] => {
  const key = createRouteKey(score, dartsInHand);
  const customRoute = customRoutes[key];

  if (customRoute) {
    return customRoute;
  }

  const defaultRoutes = DEFAULT_ROUTES[score];

  if (!defaultRoutes) {
    return [];
  }

  switch (dartsInHand) {
    case 1:
      return defaultRoutes.oneDart;
    case 2:
      return defaultRoutes.twoDarts;
    case 3:
      return defaultRoutes.threeDarts;
  }
};

export const isCustomRoute = (
  score: number,
  dartsInHand: 1 | 2 | 3,
  customRoutes: CheckoutData["customRoutes"]
): boolean => {
  const key = createRouteKey(score, dartsInHand);
  return key in customRoutes;
};

export const saveCustomRoute = (
  score: number,
  dartsInHand: 1 | 2 | 3,
  route: DartScore[],
  currentData: CheckoutData
): StorageResult<CheckoutData> => {
  const key = createRouteKey(score, dartsInHand);

  const updatedData: CheckoutData = {
    customRoutes: {
      ...currentData.customRoutes,
      [key]: route,
    },
  };

  const writeResult = writeToLocalStorage(updatedData);

  if (!writeResult.success) {
    return {
      success: false,
      error: writeResult.error,
    };
  }

  return {
    success: true,
    data: updatedData,
  };
};

export const resetToDefaultRoute = (
  score: number,
  dartsInHand: 1 | 2 | 3,
  currentData: CheckoutData
): StorageResult<CheckoutData> => {
  const key = createRouteKey(score, dartsInHand);

  const { [key]: _, ...remainingRoutes } = currentData.customRoutes;

  const updatedData: CheckoutData = {
    customRoutes: remainingRoutes,
  };

  const writeResult = writeToLocalStorage(updatedData);

  if (!writeResult.success) {
    return {
      success: false,
      error: writeResult.error,
    };
  }

  return {
    success: true,
    data: updatedData,
  };
};

export const mergeDefaultAndCustomRoutes = (
  customRoutes: CheckoutData["customRoutes"]
): Record<number, CheckoutRoutes> => {
  const merged: Record<number, CheckoutRoutes> = {};

  for (const score in DEFAULT_ROUTES) {
    const scoreNum = parseInt(score, 10);
    const defaultRoutes = DEFAULT_ROUTES[scoreNum];

    merged[scoreNum] = {
      oneDart:
        customRoutes[createRouteKey(scoreNum, 1)] || defaultRoutes.oneDart,
      twoDarts:
        customRoutes[createRouteKey(scoreNum, 2)] || defaultRoutes.twoDarts,
      threeDarts:
        customRoutes[createRouteKey(scoreNum, 3)] || defaultRoutes.threeDarts,
    };
  }

  return merged;
};
