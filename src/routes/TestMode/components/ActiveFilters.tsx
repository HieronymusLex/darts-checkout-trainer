import type { ScoreRange } from "@/hooks/useTestMode";

interface ActiveFiltersProps {
  scoreRanges: ScoreRange[];
  dartsInHand: (1 | 2 | 3)[];
}

export const ActiveFilters = ({
  scoreRanges,
  dartsInHand,
}: ActiveFiltersProps) => {
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
      <span className="font-medium">Active:</span>
      <div className="flex flex-wrap gap-1.5">
        {scoreRanges.map((range, index) => (
          <span
            key={index}
            className="px-2 py-0.5 text-xs bg-blue-900 text-blue-200 rounded-full"
          >
            {range.min}-{range.max}
          </span>
        ))}
        <span className="px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded-full">
          {dartsInHand.join(", ")} dart{dartsInHand.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
