import { formatTime, calculateAverageTime } from "@/utils/time";

interface SessionStatsProps {
  correct: number;
  total: number;
  totalTime: number;
}

export const SessionStats = ({
  correct,
  total,
  totalTime,
}: SessionStatsProps) => {
  const averageTime = calculateAverageTime(totalTime, total);

  return (
    <div className="mb-4 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Score:</span>
        <span className="font-bold text-white">
          {correct}/{total}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Avg Time:</span>
        <span className="font-bold text-white">{formatTime(averageTime)}s</span>
      </div>
    </div>
  );
};
