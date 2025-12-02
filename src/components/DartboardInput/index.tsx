import { useState, useEffect } from "react";
import { Button } from "../Button";
import { ModifierButton } from "./ModifierButton";
import { DartDisplay } from "./DartDisplay";
import { DARTBOARD_SCORES } from "@/constants";
import type { DartScore } from "@/utils/darts";

interface DartboardInputProps {
  onSubmit: (darts: DartScore[]) => void;
  maxDarts: number;
  disabled?: boolean;
}

type Modifier = "S" | "D" | "T";

export const DartboardInput = ({
  onSubmit,
  maxDarts,
  disabled = false,
}: DartboardInputProps) => {
  const [selectedDarts, setSelectedDarts] = useState<DartScore[]>([]);
  const [modifier, setModifier] = useState<Modifier>("S");

  const handleScoreClick = (score: number) => {
    if (selectedDarts.length >= maxDarts || disabled) return;

    const dartNotation = `${modifier}${score}` as DartScore;
    setSelectedDarts([...selectedDarts, dartNotation]);
    setModifier("S");
  };

  const handleBullClick = (bull: string) => {
    if (selectedDarts.length >= maxDarts || disabled) return;

    setSelectedDarts([...selectedDarts, bull as DartScore]);
    setModifier("S");
  };

  const handleClear = () => {
    setSelectedDarts([]);
    setModifier("S");
  };

  const handleUndo = () => {
    setSelectedDarts(selectedDarts.slice(0, -1));
  };

  const handleSubmit = () => {
    if (selectedDarts.length > 0) {
      onSubmit(selectedDarts);
      setSelectedDarts([]);
      setModifier("S");
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;

      const key = e.key.toLowerCase();

      if (key === "s") {
        e.preventDefault();
        setModifier("S");
      } else if (key === "d") {
        e.preventDefault();
        setModifier("D");
      } else if (key === "t") {
        e.preventDefault();
        setModifier("T");
      } else if (key === "enter") {
        e.preventDefault();
        handleSubmit();
      } else if (key === "backspace") {
        e.preventDefault();
        handleUndo();
      } else if (key >= "0" && key <= "9") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [disabled, selectedDarts, modifier, maxDarts]);

  return (
    <div className="space-y-2">
      <DartDisplay darts={selectedDarts} />

      <div className="grid grid-cols-3 gap-2">
        <ModifierButton
          label="Single"
          shortcut="S"
          isActive={modifier === "S"}
          onClick={() => setModifier("S")}
          disabled={disabled}
          variant="single"
        />
        <ModifierButton
          label="Double"
          shortcut="D"
          isActive={modifier === "D"}
          onClick={() => setModifier("D")}
          disabled={disabled}
          variant="double"
        />
        <ModifierButton
          label="Triple"
          shortcut="T"
          isActive={modifier === "T"}
          onClick={() => setModifier("T")}
          disabled={disabled}
          variant="triple"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {DARTBOARD_SCORES.map((score) => (
          <button
            key={score}
            onClick={() => handleScoreClick(score)}
            disabled={selectedDarts.length >= maxDarts || disabled}
            className={`py-3 rounded font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
              selectedDarts.length >= maxDarts || disabled
                ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
                : "bg-gray-700 text-gray-100 hover:bg-gray-600 hover:text-white border border-gray-600 hover:border-blue-500 shadow-sm hover:shadow-md"
            }`}
          >
            {score}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleBullClick("BULL")}
          disabled={selectedDarts.length >= maxDarts || disabled}
          className={`py-3 rounded font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
            selectedDarts.length >= maxDarts || disabled
              ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
              : "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md"
          }`}
        >
          Bullseye (50)
        </button>
        <button
          onClick={() => handleBullClick("OB")}
          disabled={selectedDarts.length >= maxDarts || disabled}
          className={`py-3 rounded font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
            selectedDarts.length >= maxDarts || disabled
              ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
              : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
          }`}
        >
          Outer Bull (25)
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleUndo}
          disabled={selectedDarts.length === 0 || disabled}
          variant="danger"
          className="flex-1"
        >
          Undo <span className="text-xs opacity-75">(⌫)</span>
        </Button>
        <Button
          onClick={handleClear}
          disabled={selectedDarts.length === 0 || disabled}
          variant="secondary"
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedDarts.length === 0 || disabled}
          variant="primary"
          className="flex-1"
        >
          Submit <span className="text-xs opacity-75">(↵)</span>
        </Button>
      </div>
    </div>
  );
};
