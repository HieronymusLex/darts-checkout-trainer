import { FiSearch } from "react-icons/fi";

interface ScoreInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
}

export const ScoreInput = ({
  value,
  onChange,
  onSubmit,
  error,
}: ScoreInputProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter score (2-170)"
              className={`w-full px-4 py-3 pr-12 border rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900 text-lg shadow-sm transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500 bg-red-900 text-white placeholder-red-300"
                  : "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
              }`}
              aria-label="Score input"
              aria-invalid={!!error}
              aria-describedby={error ? "score-error" : undefined}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-sm transition-all outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Search"
            >
              <FiSearch size={24} />
            </button>
          </div>
          {error && (
            <p
              id="score-error"
              className="mt-2 text-sm text-red-400 font-medium"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
