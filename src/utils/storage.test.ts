import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CheckoutData } from "./storage";
import {
  readFromLocalStorage,
  writeToLocalStorage,
  getRoute,
  isCustomRoute,
  saveCustomRoute,
  resetToDefaultRoute,
  mergeDefaultAndCustomRoutes,
} from "./storage";

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("readFromLocalStorage", () => {
    it("should return empty custom routes when localStorage is empty", () => {
      const result = readFromLocalStorage();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ customRoutes: {} });
    });

    it("should return stored custom routes", () => {
      const testData: CheckoutData = {
        customRoutes: {
          "100-3": ["T20", "T20", "D10"],
        },
      };

      localStorage.setItem(
        "darts-checkout-custom-routes",
        JSON.stringify(testData)
      );

      const result = readFromLocalStorage();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it("should handle corrupted data gracefully", () => {
      localStorage.setItem("darts-checkout-custom-routes", "invalid json");

      const result = readFromLocalStorage();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("writeToLocalStorage", () => {
    it("should write data to localStorage", () => {
      const testData: CheckoutData = {
        customRoutes: {
          "100-3": ["T20", "T20", "D10"],
        },
      };

      const result = writeToLocalStorage(testData);

      expect(result.success).toBe(true);

      const stored = localStorage.getItem("darts-checkout-custom-routes");
      expect(stored).toBe(JSON.stringify(testData));
    });

    it("should handle quota exceeded error", () => {
      // Store original localStorage
      const originalLocalStorage = window.localStorage;
      
      // Mock localStorage with setItem that throws
      const mockLocalStorage = {
        setItem: vi.fn(() => {
          const quotaError = new DOMException("QuotaExceededError", "QuotaExceededError");
          throw quotaError;
        }),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });

      const testData: CheckoutData = {
        customRoutes: {},
      };

      const result = writeToLocalStorage(testData);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe("localStorage quota exceeded");

      // Restore original localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      });
    });
  });

  describe("getRoute", () => {
    it("should return custom route when available", () => {
      const customRoutes = {
        "100-3": ["T19", "T19", "D12"],
      };

      const route = getRoute(100, 3, customRoutes);

      expect(route).toEqual(["T19", "T19", "D12"]);
    });

    it("should return default route when no custom route exists", () => {
      const customRoutes = {};

      const route = getRoute(100, 3, customRoutes);

      expect(route).toEqual(["T20", "D20"]);
    });

    it("should return empty array for non-existent score", () => {
      const customRoutes = {};

      const route = getRoute(999, 3, customRoutes);

      expect(route).toEqual([]);
    });

    it("should return correct route for different darts in hand", () => {
      const customRoutes = {};

      const route1 = getRoute(100, 1, customRoutes);
      const route2 = getRoute(100, 2, customRoutes);
      const route3 = getRoute(100, 3, customRoutes);

      expect(route1).toEqual(["T20"]);
      expect(route2).toEqual(["T20", "D20"]);
      expect(route3).toEqual(["T20", "D20"]);
    });
  });

  describe("isCustomRoute", () => {
    it("should return true for custom routes", () => {
      const customRoutes = {
        "100-3": ["T19", "T19", "D12"],
      };

      expect(isCustomRoute(100, 3, customRoutes)).toBe(true);
    });

    it("should return false for default routes", () => {
      const customRoutes = {};

      expect(isCustomRoute(100, 3, customRoutes)).toBe(false);
    });
  });

  describe("saveCustomRoute", () => {
    it("should save custom route and return updated data", () => {
      const currentData: CheckoutData = {
        customRoutes: {},
      };

      const result = saveCustomRoute(
        100,
        3,
        ["T19", "T19", "D12"],
        currentData
      );

      expect(result.success).toBe(true);
      expect(result.data?.customRoutes["100-3"]).toEqual(["T19", "T19", "D12"]);

      const stored = localStorage.getItem("darts-checkout-custom-routes");
      expect(stored).toBeDefined();
    });

    it("should preserve existing custom routes", () => {
      const currentData: CheckoutData = {
        customRoutes: {
          "50-2": ["S10", "D20"],
        },
      };

      const result = saveCustomRoute(
        100,
        3,
        ["T19", "T19", "D12"],
        currentData
      );

      expect(result.success).toBe(true);
      expect(result.data?.customRoutes["50-2"]).toEqual(["S10", "D20"]);
      expect(result.data?.customRoutes["100-3"]).toEqual(["T19", "T19", "D12"]);
    });
  });

  describe("resetToDefaultRoute", () => {
    it("should remove custom route", () => {
      const currentData: CheckoutData = {
        customRoutes: {
          "100-3": ["T19", "T19", "D12"],
        },
      };

      const result = resetToDefaultRoute(100, 3, currentData);

      expect(result.success).toBe(true);
      expect(result.data?.customRoutes["100-3"]).toBeUndefined();
    });

    it("should preserve other custom routes", () => {
      const currentData: CheckoutData = {
        customRoutes: {
          "100-3": ["T19", "T19", "D12"],
          "50-2": ["S10", "D20"],
        },
      };

      const result = resetToDefaultRoute(100, 3, currentData);

      expect(result.success).toBe(true);
      expect(result.data?.customRoutes["100-3"]).toBeUndefined();
      expect(result.data?.customRoutes["50-2"]).toEqual(["S10", "D20"]);
    });
  });

  describe("mergeDefaultAndCustomRoutes", () => {
    it("should merge custom routes with defaults", () => {
      const customRoutes = {
        "100-3": ["T19", "T19", "D12"],
      };

      const merged = mergeDefaultAndCustomRoutes(customRoutes);

      expect(merged[100].threeDarts).toEqual(["T19", "T19", "D12"]);
      expect(merged[100].twoDarts).toEqual(["T20", "D20"]);
      expect(merged[100].oneDart).toEqual(["T20"]);
    });

    it("should return all default routes when no custom routes exist", () => {
      const customRoutes = {};

      const merged = mergeDefaultAndCustomRoutes(customRoutes);

      expect(merged[100].threeDarts).toEqual(["T20", "D20"]);
      expect(merged[50].oneDart).toEqual(["BULL"]);
    });
  });
});
