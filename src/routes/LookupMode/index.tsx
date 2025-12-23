import { useState } from "react";
import { RouteEditor } from "@/components/RouteEditor";
import { ScoreGrid } from "@/components/ScoreGrid";
import { useCheckoutRoutes } from "@/hooks/useCheckoutRoutes";
import { useRouteEditor } from "@/hooks/useRouteEditor";
import { validateScoreInput } from "@/utils/validators";
import { ScoreInput } from "./components/ScoreInput";
import { CheckoutDrawer } from "./components/CheckoutDrawer";

export const LookupMode = () => {
  const [scoreInput, setScoreInput] = useState("");
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  const { getRoute, updateRoute, resetRoute, storageError } =
    useCheckoutRoutes();
  const { editingRoute, startEdit, saveEdit, resetEdit, cancelEdit } =
    useRouteEditor(updateRoute, resetRoute);

  const handleScoreInputChange = (value: string) => {
    setScoreInput(value);
    setValidationError("");
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateScoreInput(scoreInput);

    if (!validation.valid) {
      setValidationError(validation.error || "Invalid score");
      setSelectedScore(null);
      return;
    }

    const score = Number(scoreInput);
    setSelectedScore(score);
    setValidationError("");
  };

  const handleGridButtonClick = (score: number) => {
    if (selectedScore === score) {
      setSelectedScore(null);
      setScoreInput("");
    } else {
      setScoreInput(score.toString());
      setSelectedScore(score);
    }
    setValidationError("");
  };

  const handleClearSelection = () => {
    setSelectedScore(null);
    setScoreInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-64">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Route Lookup</h2>
        <p className="text-gray-400">
          Enter a score or select from the grid to view checkout routes
        </p>
      </div>

      {storageError && (
        <div className="mb-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-200">{storageError}</p>
        </div>
      )}

      <ScoreInput
        value={scoreInput}
        onChange={handleScoreInputChange}
        onSubmit={handleScoreSubmit}
        error={validationError}
      />

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Score Selector
        </h3>
        <ScoreGrid
          selectedScore={selectedScore}
          onScoreClick={handleGridButtonClick}
        />
      </div>

      <CheckoutDrawer
        score={selectedScore}
        onClose={handleClearSelection}
        getRoute={getRoute}
        onEdit={startEdit}
      />

      {editingRoute && (
        <RouteEditor
          score={editingRoute.score}
          dartsInHand={editingRoute.dartsInHand}
          currentRoute={editingRoute.route}
          onSave={saveEdit}
          onCancel={cancelEdit}
          onReset={resetEdit}
        />
      )}
    </div>
  );
};
