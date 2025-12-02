import { useState } from "react";
import { Button } from "@/components/Button";
import { DoubleDistributionStats } from "@/components/DoubleDistributionStats";

type StatsView = "combined" | 2 | 3;

export const StatsMode = () => {
  const [statsView, setStatsView] = useState<StatsView>("combined");

  return (
    <div className="max-w-7xl mx-auto px-6 pb-64">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Double Distribution Statistics
        </h2>
        <p className="text-gray-400">
          View the distribution of doubles in checkout routes
        </p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          onClick={() => setStatsView("combined")}
          variant="secondary"
          active={statsView === "combined"}
          className="px-6 py-2"
        >
          Combined
        </Button>
        <Button
          onClick={() => setStatsView(3)}
          variant="secondary"
          active={statsView === 3}
          className="px-6 py-2"
        >
          3-Dart Stats
        </Button>
        <Button
          onClick={() => setStatsView(2)}
          variant="secondary"
          active={statsView === 2}
          className="px-6 py-2"
        >
          2-Dart Stats
        </Button>
      </div>
      <DoubleDistributionStats dartsInHand={statsView} />
    </div>
  );
};
