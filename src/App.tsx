import { useState } from "react";
import "./App.css";
import { FiSearch, FiTarget, FiBarChart2 } from "react-icons/fi";
import { LookupMode } from "@/routes/LookupMode";
import { TestMode } from "@/routes/TestMode";
import { StatsMode } from "@/routes/StatsMode";

type AppMode = "lookup" | "test" | "stats";

function App() {
  const [mode, setMode] = useState<AppMode>("lookup");

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Darts Checkout Trainer
            </h1>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => setMode("lookup")}
                className={`flex items-center gap-2 font-medium transition-all focus:outline-none ${
                  mode === "lookup"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FiSearch size={20} />
                <span className="hidden sm:inline">Lookup</span>
              </button>
              <button
                onClick={() => setMode("test")}
                className={`flex items-center gap-2 font-medium transition-all focus:outline-none ${
                  mode === "test"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FiTarget size={20} />
                <span className="hidden sm:inline">Test</span>
              </button>
              <button
                onClick={() => setMode("stats")}
                className={`flex items-center gap-2 font-medium transition-all focus:outline-none ${
                  mode === "stats"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FiBarChart2 size={20} />
                <span className="hidden sm:inline">Stats</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-8">
        {mode === "lookup" && <LookupMode key="lookup" />}
        {mode === "test" && <TestMode key="test" />}
        {mode === "stats" && <StatsMode key="stats" />}
      </main>
    </div>
  );
}

export default App;
