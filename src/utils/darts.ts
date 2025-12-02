export type DartScore = string;

export interface CheckoutRoutes {
  oneDart: DartScore[];
  twoDarts: DartScore[];
  threeDarts: DartScore[];
}

export const convertNotationToValue = (notation: DartScore): number => {
  const upperNotation = notation.toUpperCase().trim();

  if (upperNotation === "BULL" || upperNotation === "D25") {
    return 50;
  }

  if (upperNotation === "OB" || upperNotation === "S25") {
    return 25;
  }

  const trebleMatch = upperNotation.match(/^T(\d+)$/);
  if (trebleMatch) {
    const value = parseInt(trebleMatch[1], 10);
    if (value >= 1 && value <= 20) {
      return value * 3;
    }
  }

  const doubleMatch = upperNotation.match(/^D(\d+)$/);
  if (doubleMatch) {
    const value = parseInt(doubleMatch[1], 10);
    if (value >= 1 && value <= 20) {
      return value * 2;
    }
  }

  const singleMatch = upperNotation.match(/^S(\d+)$/);
  if (singleMatch) {
    const value = parseInt(singleMatch[1], 10);
    if (value >= 1 && value <= 20) {
      return value;
    }
  }

  throw new Error(`Invalid dart notation: ${notation}`);
};

export const validateNotation = (notation: DartScore): boolean => {
  try {
    convertNotationToValue(notation);
    return true;
  } catch {
    return false;
  }
};

export const isValidNotationFormat = (notation: DartScore): boolean => {
  const upperNotation = notation.toUpperCase().trim();

  if (
    upperNotation === "BULL" ||
    upperNotation === "OB" ||
    upperNotation === "D25" ||
    upperNotation === "S25"
  ) {
    return true;
  }

  const patterns = [
    /^T([1-9]|1[0-9]|20)$/,
    /^D([1-9]|1[0-9]|20|25)$/,
    /^S([1-9]|1[0-9]|20|25)$/,
  ];

  return patterns.some((pattern) => pattern.test(upperNotation));
};

export { DEFAULT_ROUTES } from "@/data/defaultRoutes";
