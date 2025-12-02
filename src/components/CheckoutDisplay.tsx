import { FiEdit2 } from "react-icons/fi";
import type { DartScore } from "@/utils/darts";

interface CheckoutDisplayProps {
  score: number;
  dartsInHand: 1 | 2 | 3;
  route: DartScore[];
  isCustom: boolean;
  onEdit?: (newRoute: DartScore[]) => void;
}

export const CheckoutDisplay = ({
  score,
  dartsInHand,
  route,
  isCustom,
  onEdit,
}: CheckoutDisplayProps) => {
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(route);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border border-gray-700 rounded bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs font-bold text-gray-400 min-w-[12px]">
          {dartsInHand}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {route.map((dart, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-sm font-semibold bg-gray-700 text-gray-100 rounded border border-gray-600"
            >
              {dart}
            </span>
          ))}
        </div>
        {isCustom && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-900 text-blue-200 rounded-full ml-auto">
            Custom
          </span>
        )}
      </div>
      {onEdit && (
        <button
          onClick={handleEditClick}
          className="ml-2 p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800"
          aria-label={`Edit checkout route for ${score} with ${dartsInHand} darts`}
        >
          <FiEdit2 size={16} />
        </button>
      )}
    </div>
  );
};
