import { useState, useEffect } from "react";
import { FiX, FiRotateCcw, FiCheck } from "react-icons/fi";
import type { DartScore } from "@/utils/darts";
import { convertNotationToValue, isValidNotationFormat } from "@/utils/darts";

interface RouteEditorProps {
  score: number;
  dartsInHand: 1 | 2 | 3;
  currentRoute: DartScore[];
  onSave: (newRoute: DartScore[]) => void;
  onCancel: () => void;
  onReset?: () => void;
}

export const RouteEditor = ({
  score,
  dartsInHand,
  currentRoute,
  onSave,
  onCancel,
  onReset,
}: RouteEditorProps) => {
  const [dartInputs, setDartInputs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string>("");

  useEffect(() => {
    setDartInputs(currentRoute.map((dart) => dart));
    setErrors(new Array(dartsInHand).fill(""));
    setGeneralError("");
  }, [currentRoute, dartsInHand]);

  const validateRoute = (inputs: string[]): boolean => {
    const newErrors = new Array(dartsInHand).fill("");
    let hasError = false;

    for (let i = 0; i < dartsInHand; i++) {
      const input = inputs[i]?.trim() || "";

      if (!input) {
        newErrors[i] = "Dart notation required";
        hasError = true;
        continue;
      }

      if (!isValidNotationFormat(input)) {
        newErrors[i] = "Invalid notation format";
        hasError = true;
        continue;
      }

      try {
        convertNotationToValue(input);
      } catch {
        newErrors[i] = "Invalid dart value";
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) {
      setGeneralError("");
      return false;
    }

    let total = 0;
    try {
      for (let i = 0; i < dartsInHand; i++) {
        total += convertNotationToValue(inputs[i]);
      }
    } catch {
      setGeneralError("Invalid dart notation");
      return false;
    }

    if (total !== score) {
      setGeneralError(
        `Route total (${total}) must equal target score (${score})`
      );
      return false;
    }

    const lastDart = inputs[dartsInHand - 1].toUpperCase().trim();
    const isDouble =
      lastDart.startsWith("D") || lastDart === "BULL" || lastDart === "D25";

    if (!isDouble) {
      setGeneralError("Route must end with a double or bullseye");
      return false;
    }

    setGeneralError("");
    return true;
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...dartInputs];
    newInputs[index] = value;
    setDartInputs(newInputs);

    const newErrors = [...errors];
    newErrors[index] = "";
    setErrors(newErrors);
    setGeneralError("");
  };

  const handleSave = () => {
    if (validateRoute(dartInputs)) {
      const normalizedRoute = dartInputs.map((input) =>
        input.toUpperCase().trim()
      );
      onSave(normalizedRoute as DartScore[]);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Edit Checkout Route
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close editor"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Score: <span className="font-semibold text-white">{score}</span> |
            Darts:{" "}
            <span className="font-semibold text-white">{dartsInHand}</span>
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {Array.from({ length: dartsInHand }).map((_, index) => (
            <div key={index}>
              <label
                htmlFor={`dart-${index}`}
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Dart {index + 1}
              </label>
              <input
                id={`dart-${index}`}
                type="text"
                value={dartInputs[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="e.g., T20, D16, BULL"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 shadow-sm transition-all ${
                  errors[index]
                    ? "border-red-500 focus:ring-red-500 bg-red-900 text-white placeholder-red-300"
                    : "border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                }`}
              />
              {errors[index] && (
                <p className="mt-1 text-sm text-red-400">{errors[index]}</p>
              )}
            </div>
          ))}
        </div>

        {generalError && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-sm text-red-200">{generalError}</p>
          </div>
        )}

        <div className="text-xs text-gray-400 mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
          <p className="font-medium mb-1 text-gray-300">
            Valid notation formats:
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Trebles: T1-T20 (e.g., T20 = 60)</li>
            <li>Doubles: D1-D20, D25 (e.g., D16 = 32)</li>
            <li>Singles: S1-S20 (e.g., S19 = 19)</li>
            <li>Bullseye: BULL (50 points)</li>
            <li>Outer Bull: OB (25 points)</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:scale-[0.98]"
          >
            <FiCheck size={18} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:scale-[0.98] border border-gray-600"
          >
            Cancel
          </button>
          {onReset && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-orange-900 text-orange-200 rounded-lg hover:bg-orange-800 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-800 active:scale-[0.98] border border-orange-800"
              aria-label="Reset to default"
            >
              <FiRotateCcw size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
