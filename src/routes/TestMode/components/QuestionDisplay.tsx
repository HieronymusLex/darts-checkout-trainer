interface QuestionDisplayProps {
  score: number;
  dartsInHand: 1 | 2 | 3;
}

export const QuestionDisplay = ({
  score,
  dartsInHand,
}: QuestionDisplayProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded shadow-lg p-8 mb-2">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          Current Question
        </h3>
        <div className="flex items-center justify-center gap-8">
          <div>
            <p className="text-sm text-gray-400 mb-1">Score</p>
            <p className="text-5xl font-bold text-white">{score}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Darts in Hand</p>
            <p className="text-5xl font-bold text-blue-400">{dartsInHand}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
