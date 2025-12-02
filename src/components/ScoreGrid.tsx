import { Button } from "./Button";
import { MIN_SCORE, MAX_SCORE } from "@/constants";

interface ScoreGridProps {
  selectedScore: number | null;
  onScoreClick: (score: number) => void;
  scores?: number[];
}

export const ScoreGrid = ({
  selectedScore,
  onScoreClick,
  scores: customScores,
}: ScoreGridProps) => {
  const scores =
    customScores ||
    Array.from({ length: MAX_SCORE - MIN_SCORE + 1 }, (_, i) => MIN_SCORE + i);

  return (
    <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-17 gap-2">
      {scores.map((score) => (
        <Button
          key={score}
          onClick={() => onScoreClick(score)}
          variant="secondary"
          size="sm"
          active={selectedScore === score}
          aria-label={`Select score ${score}`}
        >
          {score}
        </Button>
      ))}
    </div>
  );
};
