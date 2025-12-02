import type { DartScore } from "@/utils/darts";

interface DartDisplayProps {
  darts: DartScore[];
}

export const DartDisplay = ({ darts }: DartDisplayProps) => {
  return (
    <div className="bg-gray-700 rounded p-4 h-[76px] border border-gray-600 flex items-center">
      <div className="flex items-center gap-2 flex-wrap">
        {darts.length === 0 ? (
          <span className="text-gray-400 text-sm">
            Select darts using the board below...
          </span>
        ) : (
          darts.map((dart, index) => (
            <span
              key={index}
              className="px-3 py-1.5 text-lg font-semibold bg-gray-600 text-gray-100 rounded border border-gray-500 shadow-sm"
            >
              {dart}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
