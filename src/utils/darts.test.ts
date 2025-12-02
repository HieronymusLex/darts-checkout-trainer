import { describe, it, expect } from "vitest";
import {
  convertNotationToValue,
  validateNotation,
  isValidNotationFormat,
  DEFAULT_ROUTES,
} from "./darts";

describe("convertNotationToValue", () => {
  it("should convert treble notation correctly", () => {
    expect(convertNotationToValue("T20")).toBe(60);
    expect(convertNotationToValue("T19")).toBe(57);
    expect(convertNotationToValue("T1")).toBe(3);
  });

  it("should convert double notation correctly", () => {
    expect(convertNotationToValue("D20")).toBe(40);
    expect(convertNotationToValue("D16")).toBe(32);
    expect(convertNotationToValue("D1")).toBe(2);
  });

  it("should convert single notation correctly", () => {
    expect(convertNotationToValue("S20")).toBe(20);
    expect(convertNotationToValue("S19")).toBe(19);
    expect(convertNotationToValue("S1")).toBe(1);
  });

  it("should convert bullseye notation correctly", () => {
    expect(convertNotationToValue("BULL")).toBe(50);
    expect(convertNotationToValue("D25")).toBe(50);
  });

  it("should convert outer bull notation correctly", () => {
    expect(convertNotationToValue("OB")).toBe(25);
    expect(convertNotationToValue("S25")).toBe(25);
  });

  it("should handle case insensitive input", () => {
    expect(convertNotationToValue("t20")).toBe(60);
    expect(convertNotationToValue("d16")).toBe(32);
    expect(convertNotationToValue("bull")).toBe(50);
  });

  it("should throw error for invalid notation", () => {
    expect(() => convertNotationToValue("T21")).toThrow(
      "Invalid dart notation"
    );
    expect(() => convertNotationToValue("D21")).toThrow(
      "Invalid dart notation"
    );
    expect(() => convertNotationToValue("X20")).toThrow(
      "Invalid dart notation"
    );
    expect(() => convertNotationToValue("invalid")).toThrow(
      "Invalid dart notation"
    );
  });
});

describe("validateNotation", () => {
  it("should return true for valid notation", () => {
    expect(validateNotation("T20")).toBe(true);
    expect(validateNotation("D16")).toBe(true);
    expect(validateNotation("S19")).toBe(true);
    expect(validateNotation("BULL")).toBe(true);
    expect(validateNotation("OB")).toBe(true);
  });

  it("should return false for invalid notation", () => {
    expect(validateNotation("T21")).toBe(false);
    expect(validateNotation("invalid")).toBe(false);
    expect(validateNotation("X20")).toBe(false);
  });
});

describe("isValidNotationFormat", () => {
  it("should validate treble format", () => {
    expect(isValidNotationFormat("T20")).toBe(true);
    expect(isValidNotationFormat("T1")).toBe(true);
    expect(isValidNotationFormat("T21")).toBe(false);
    expect(isValidNotationFormat("T0")).toBe(false);
  });

  it("should validate double format", () => {
    expect(isValidNotationFormat("D20")).toBe(true);
    expect(isValidNotationFormat("D25")).toBe(true);
    expect(isValidNotationFormat("D1")).toBe(true);
    expect(isValidNotationFormat("D26")).toBe(false);
  });

  it("should validate single format", () => {
    expect(isValidNotationFormat("S20")).toBe(true);
    expect(isValidNotationFormat("S25")).toBe(true);
    expect(isValidNotationFormat("S1")).toBe(true);
    expect(isValidNotationFormat("S26")).toBe(false);
  });

  it("should validate special notations", () => {
    expect(isValidNotationFormat("BULL")).toBe(true);
    expect(isValidNotationFormat("OB")).toBe(true);
  });
});

describe("DEFAULT_ROUTES", () => {
  it("should have routes for key checkouts", () => {
    expect(DEFAULT_ROUTES[170].threeDarts).toEqual(["T20", "T20", "BULL"]);
    expect(DEFAULT_ROUTES[100].threeDarts).toEqual(["T20", "D20"]);
    expect(DEFAULT_ROUTES[100].twoDarts).toEqual(["T20", "D20"]);
    expect(DEFAULT_ROUTES[50].oneDart).toEqual(["BULL"]);
    expect(DEFAULT_ROUTES[40].oneDart).toEqual(["D20"]);
  });

  it("should have all three dart scenarios for each score", () => {
    Object.values(DEFAULT_ROUTES).forEach((routes) => {
      expect(routes.oneDart).toBeDefined();
      expect(routes.twoDarts).toBeDefined();
      expect(routes.threeDarts).toBeDefined();
      expect(Array.isArray(routes.oneDart)).toBe(true);
      expect(Array.isArray(routes.twoDarts)).toBe(true);
      expect(Array.isArray(routes.threeDarts)).toBe(true);
    });
  });

  it("should have valid notation for all routes", () => {
    Object.values(DEFAULT_ROUTES).forEach((routes) => {
      [...routes.oneDart, ...routes.twoDarts, ...routes.threeDarts].forEach(
        (dart) => {
          expect(validateNotation(dart)).toBe(true);
        }
      );
    });
  });

  it("should have correct number of darts in each route", () => {
    Object.values(DEFAULT_ROUTES).forEach((routes) => {
      expect(routes.oneDart.length).toBeLessThanOrEqual(1);
      expect(routes.twoDarts.length).toBeLessThanOrEqual(2);
      expect(routes.threeDarts.length).toBeLessThanOrEqual(3);
    });
  });
});
