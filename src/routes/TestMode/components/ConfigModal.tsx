import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { SCORE_RANGES, DARTS_OPTIONS } from "@/constants";
import type { ScoreRange } from "@/hooks/useTestMode";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreRanges: ScoreRange[];
  dartsInHand: (1 | 2 | 3)[];
  onScoreRangeToggle: (range: ScoreRange) => void;
  onDartsToggle: (darts: 1 | 2 | 3) => void;
}

export const ConfigModal = ({
  isOpen,
  onClose,
  scoreRanges,
  dartsInHand,
  onScoreRangeToggle,
  onDartsToggle,
}: ConfigModalProps) => {
  const isRangeActive = (range: ScoreRange) => {
    return scoreRanges.some((r) => r.min === range.min && r.max === range.max);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuration & Filters"
      footer={
        <Button onClick={onClose} variant="primary" className="w-full">
          Done
        </Button>
      }
    >
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Score Ranges
        </h4>
        <div className="flex flex-wrap gap-2">
          {SCORE_RANGES.map((range) => (
            <Button
              key={`${range.min}-${range.max}`}
              onClick={() => onScoreRangeToggle(range)}
              variant="secondary"
              active={isRangeActive(range)}
              className="px-4 py-2"
            >
              {range.min}-{range.max}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Darts in Hand
        </h4>
        <div className="flex flex-wrap gap-2">
          {DARTS_OPTIONS.map((darts) => (
            <Button
              key={darts}
              onClick={() => onDartsToggle(darts)}
              variant="secondary"
              active={dartsInHand.includes(darts)}
              className="px-4 py-2"
            >
              {darts} {darts === 1 ? "dart" : "darts"}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
