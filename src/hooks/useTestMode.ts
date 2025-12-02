import { useState, useEffect, useCallback } from "react";
import type { DartScore } from "@/utils/darts";
import { convertNotationToValue } from "@/utils/darts";
import { DEFAULT_ROUTES } from "@/data/defaultRoutes";

const TEST_MODE_CONFIG_KEY = "darts-checkout-test-mode-config";

export interface TestModeConfig {
  scoreRanges: ScoreRange[];
  dartsInHand: (1 | 2 | 3)[];
}

export interface ScoreRange {
  min: number;
  max: number;
}

export interface TestQuestion {
  score: number;
  dartsInHand: 1 | 2 | 3;
}

interface UseTestModeReturn {
  currentQuestion: TestQuestion;
  checkAnswer: (userAnswer: DartScore[]) => boolean;
  nextQuestion: () => void;
  correctRoute: DartScore[];
  config: TestModeConfig;
  updateConfig: (config: TestModeConfig) => void;
}

const DEFAULT_CONFIG: TestModeConfig = {
  scoreRanges: [
    { min: 2, max: 50 },
    { min: 51, max: 100 },
    { min: 101, max: 170 },
  ],
  dartsInHand: [1, 2, 3],
};

const loadConfig = (): TestModeConfig => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return DEFAULT_CONFIG;
    }

    const stored = localStorage.getItem(TEST_MODE_CONFIG_KEY);
    if (!stored) {
      return DEFAULT_CONFIG;
    }

    const parsed = JSON.parse(stored) as TestModeConfig;

    if (
      !parsed.scoreRanges ||
      !Array.isArray(parsed.scoreRanges) ||
      !parsed.dartsInHand ||
      !Array.isArray(parsed.dartsInHand)
    ) {
      return DEFAULT_CONFIG;
    }

    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
};

const saveConfig = (config: TestModeConfig): void => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    localStorage.setItem(TEST_MODE_CONFIG_KEY, JSON.stringify(config));
  } catch {}
};

const getValidScores = (): number[] => {
  return Object.keys(DEFAULT_ROUTES).map((score) => parseInt(score, 10));
};

const filterScoresByRanges = (
  scores: number[],
  ranges: ScoreRange[]
): number[] => {
  return scores.filter((score) =>
    ranges.some((range) => score >= range.min && score <= range.max)
  );
};

const generateRandomQuestion = (
  config: TestModeConfig,
  previousQuestion: TestQuestion | null
): TestQuestion => {
  const validScores = getValidScores();
  const filteredScores = filterScoresByRanges(validScores, config.scoreRanges);

  if (filteredScores.length === 0 || config.dartsInHand.length === 0) {
    return {
      score: 100,
      dartsInHand: 3,
    };
  }

  // Create valid combinations of score and darts in hand
  const validCombinations: TestQuestion[] = [];
  for (const score of filteredScores) {
    for (const darts of config.dartsInHand) {
      validCombinations.push({ score, dartsInHand: darts });
    }
  }

  if (validCombinations.length === 0) {
    return {
      score: 100,
      dartsInHand: 3,
    };
  }

  // Filter out the previous question if possible
  let availableCombinations = validCombinations;
  if (previousQuestion && validCombinations.length > 1) {
    availableCombinations = validCombinations.filter(
      (combo) =>
        combo.score !== previousQuestion.score ||
        combo.dartsInHand !== previousQuestion.dartsInHand
    );
    
    // If filtering removed all options, use all combinations
    if (availableCombinations.length === 0) {
      availableCombinations = validCombinations;
    }
  }

  // Pick a random combination
  const randomIndex = Math.floor(Math.random() * availableCombinations.length);
  return availableCombinations[randomIndex];
};

export const useTestMode = (
  getRouteCallback: (score: number, dartsInHand: 1 | 2 | 3) => DartScore[]
): UseTestModeReturn => {
  const [config, setConfig] = useState<TestModeConfig>(loadConfig);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion>(() =>
    generateRandomQuestion(config, null)
  );

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const correctRoute = getRouteCallback(
    currentQuestion.score,
    currentQuestion.dartsInHand
  );

  const checkAnswer = useCallback(
    (userAnswer: DartScore[]): boolean => {
      if (userAnswer.length !== correctRoute.length) {
        return false;
      }

      try {
        const userTotal = userAnswer.reduce(
          (sum, dart) => sum + convertNotationToValue(dart),
          0
        );
        const correctTotal = correctRoute.reduce(
          (sum, dart) => sum + convertNotationToValue(dart),
          0
        );

        if (userTotal !== correctTotal) {
          return false;
        }

        const userNormalized = userAnswer.map((dart) =>
          dart.toUpperCase().trim()
        );
        const correctNormalized = correctRoute.map((dart) =>
          dart.toUpperCase().trim()
        );

        return userNormalized.every(
          (dart, index) => dart === correctNormalized[index]
        );
      } catch {
        return false;
      }
    },
    [correctRoute]
  );

  const nextQuestion = useCallback(() => {
    const newQuestion = generateRandomQuestion(config, currentQuestion);
    setCurrentQuestion(newQuestion);
  }, [config, currentQuestion]);

  const updateConfig = useCallback((newConfig: TestModeConfig) => {
    setConfig(newConfig);
    const newQuestion = generateRandomQuestion(newConfig, null);
    setCurrentQuestion(newQuestion);
  }, []);

  return {
    currentQuestion,
    checkAnswer,
    nextQuestion,
    correctRoute,
    config,
    updateConfig,
  };
};
