import { useState, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { useCheckoutRoutes } from "@/hooks/useCheckoutRoutes";
import { useTestMode } from "@/hooks/useTestMode";
import { useSessionStats } from "@/hooks/useSessionStats";
import { useKeyPress } from "@/hooks/useKeyPress";
import { DartboardInput } from "@/components/DartboardInput";
import { SessionStart } from "./components/SessionStart";
import { SessionStats } from "./components/SessionStats";
import { ActiveFilters } from "./components/ActiveFilters";
import { QuestionDisplay } from "./components/QuestionDisplay";
import { FeedbackOverlay } from "./components/FeedbackOverlay";
import { ConfigModal } from "./components/ConfigModal";
import { FEEDBACK_MESSAGES } from "@/constants";
import type { DartScore } from "@/utils/darts";
import type { ScoreRange } from "@/hooks/useTestMode";

export const TestMode = () => {
  const { getRoute } = useCheckoutRoutes();
  const {
    currentQuestion,
    checkAnswer,
    nextQuestion,
    correctRoute,
    config,
    updateConfig,
  } = useTestMode((score, dartsInHand) => getRoute(score, dartsInHand).route);

  const {
    sessionStarted,
    sessionStats,
    startSession,
    recordAnswer,
    startNextQuestion,
  } = useSessionStats();

  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useKeyPress("Enter", () => nextButtonRef.current?.click(), !!feedback);

  const handleSubmit = (darts: DartScore[]) => {
    const isCorrect = checkAnswer(darts);
    recordAnswer(isCorrect);

    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? FEEDBACK_MESSAGES.CORRECT
        : FEEDBACK_MESSAGES.INCORRECT(correctRoute.join(", ")),
    });
  };

  const handleNextQuestion = () => {
    nextQuestion();
    setFeedback(null);
    startNextQuestion();
  };

  const handleScoreRangeToggle = (range: ScoreRange) => {
    const existingIndex = config.scoreRanges.findIndex(
      (r) => r.min === range.min && r.max === range.max
    );

    let newRanges: ScoreRange[];
    if (existingIndex >= 0) {
      newRanges = config.scoreRanges.filter((_, i) => i !== existingIndex);
    } else {
      newRanges = [...config.scoreRanges, range];
    }

    if (newRanges.length === 0) return;

    updateConfig({
      ...config,
      scoreRanges: newRanges,
    });
  };

  const handleDartsToggle = (darts: 1 | 2 | 3) => {
    const existingIndex = config.dartsInHand.indexOf(darts);

    let newDarts: (1 | 2 | 3)[];
    if (existingIndex >= 0) {
      newDarts = config.dartsInHand.filter((d) => d !== darts);
    } else {
      newDarts = [...config.dartsInHand, darts].sort();
    }

    if (newDarts.length === 0) return;

    updateConfig({
      ...config,
      dartsInHand: newDarts as (1 | 2 | 3)[],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Test Mode</h2>
          <p className="text-gray-400">
            Practice identifying correct checkout routes
          </p>
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open configuration"
        >
          <FiSettings size={24} />
        </button>
      </div>

      {sessionStarted && (
        <SessionStats
          correct={sessionStats.correct}
          total={sessionStats.total}
          totalTime={sessionStats.totalTime}
        />
      )}

      <ActiveFilters
        scoreRanges={config.scoreRanges}
        dartsInHand={config.dartsInHand}
      />

      {!sessionStarted ? (
        <SessionStart onStart={startSession} />
      ) : (
        <div className="mb-6">
          <QuestionDisplay
            score={currentQuestion.score}
            dartsInHand={currentQuestion.dartsInHand}
          />

          <div className="mb-2 relative">
            <DartboardInput
              onSubmit={handleSubmit}
              maxDarts={currentQuestion.dartsInHand}
              disabled={!!feedback}
            />

            {feedback && (
              <FeedbackOverlay
                ref={nextButtonRef}
                correct={feedback.correct}
                message={feedback.message}
                onNext={handleNextQuestion}
              />
            )}
          </div>
        </div>
      )}

      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        scoreRanges={config.scoreRanges}
        dartsInHand={config.dartsInHand}
        onScoreRangeToggle={handleScoreRangeToggle}
        onDartsToggle={handleDartsToggle}
      />
    </div>
  );
};
