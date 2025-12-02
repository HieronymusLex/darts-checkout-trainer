import { useState } from "react";

interface SessionStats {
  correct: number;
  total: number;
  startTime: number;
  questionStartTime: number;
  totalTime: number;
}

export const useSessionStats = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    correct: 0,
    total: 0,
    startTime: 0,
    questionStartTime: 0,
    totalTime: 0,
  });

  const startSession = () => {
    const now = Date.now();
    setSessionStarted(true);
    setSessionStats({
      correct: 0,
      total: 0,
      startTime: now,
      questionStartTime: now,
      totalTime: 0,
    });
  };

  const recordAnswer = (isCorrect: boolean) => {
    const questionTime = Date.now() - sessionStats.questionStartTime;
    setSessionStats((prev) => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      totalTime: prev.totalTime + questionTime,
    }));
  };

  const startNextQuestion = () => {
    setSessionStats((prev) => ({
      ...prev,
      questionStartTime: Date.now(),
    }));
  };

  return {
    sessionStarted,
    sessionStats,
    startSession,
    recordAnswer,
    startNextQuestion,
  };
};
