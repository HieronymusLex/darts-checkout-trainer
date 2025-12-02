import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckoutRoutes } from "./useCheckoutRoutes";
import * as storage from "@/utils/storage";

vi.mock("../utils/storage", async () => {
  const actual = await vi.importActual("../utils/storage");
  return {
    ...actual,
    readFromLocalStorage: vi.fn(),
    saveCustomRoute: vi.fn(),
    resetToDefaultRoute: vi.fn(),
  };
});

describe("useCheckoutRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.readFromLocalStorage).mockReturnValue({
      success: true,
      data: { customRoutes: {} },
    });
  });

  it("should initialize with empty custom routes", () => {
    const { result } = renderHook(() => useCheckoutRoutes());

    expect(result.current.isCustomRoute(100, 3)).toBe(false);
  });

  it("should load custom routes from localStorage on mount", () => {
    vi.mocked(storage.readFromLocalStorage).mockReturnValue({
      success: true,
      data: {
        customRoutes: {
          "100-3": ["T20", "T20", "D10"],
        },
      },
    });

    const { result } = renderHook(() => useCheckoutRoutes());

    expect(result.current.isCustomRoute(100, 3)).toBe(true);
  });

  it("should get a default route", () => {
    const { result } = renderHook(() => useCheckoutRoutes());

    const route = result.current.getRoute(100, 3);

    expect(route.score).toBe(100);
    expect(route.dartsInHand).toBe(3);
    expect(route.route).toEqual(["T20", "D20"]);
    expect(route.isCustom).toBe(false);
  });

  it("should update a route and save to localStorage", () => {
    vi.mocked(storage.saveCustomRoute).mockReturnValue({
      success: true,
      data: {
        customRoutes: {
          "100-3": ["T19", "T19", "D12"],
        },
      },
    });

    const { result } = renderHook(() => useCheckoutRoutes());

    act(() => {
      result.current.updateRoute(100, 3, ["T19", "T19", "D12"]);
    });

    expect(storage.saveCustomRoute).toHaveBeenCalledWith(
      100,
      3,
      ["T19", "T19", "D12"],
      { customRoutes: {} }
    );
    expect(result.current.isCustomRoute(100, 3)).toBe(true);
  });

  it("should reset a route to default", () => {
    vi.mocked(storage.readFromLocalStorage).mockReturnValue({
      success: true,
      data: {
        customRoutes: {
          "100-3": ["T19", "T19", "D12"],
        },
      },
    });

    vi.mocked(storage.resetToDefaultRoute).mockReturnValue({
      success: true,
      data: {
        customRoutes: {},
      },
    });

    const { result } = renderHook(() => useCheckoutRoutes());

    act(() => {
      result.current.resetRoute(100, 3);
    });

    expect(storage.resetToDefaultRoute).toHaveBeenCalledWith(100, 3, {
      customRoutes: {
        "100-3": ["T19", "T19", "D12"],
      },
    });
    expect(result.current.isCustomRoute(100, 3)).toBe(false);
  });

  it("should handle localStorage read failure gracefully", () => {
    vi.mocked(storage.readFromLocalStorage).mockReturnValue({
      success: false,
      error: "localStorage is not available",
    });

    const { result } = renderHook(() => useCheckoutRoutes());

    expect(result.current.storageError).toBe("localStorage is not available");
    expect(result.current.isCustomRoute(100, 3)).toBe(false);
  });

  it("should handle localStorage write failure gracefully", () => {
    vi.mocked(storage.saveCustomRoute).mockReturnValue({
      success: false,
      error: "localStorage quota exceeded",
    });

    const { result } = renderHook(() => useCheckoutRoutes());

    act(() => {
      result.current.updateRoute(100, 3, ["T19", "T19", "D12"]);
    });

    expect(result.current.storageError).toBe("localStorage quota exceeded");
    expect(result.current.isCustomRoute(100, 3)).toBe(true);
  });
});
