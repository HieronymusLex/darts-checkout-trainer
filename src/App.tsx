import { useState } from "react";
import "./App.css";
import { FiSearch, FiTarget, FiBarChart2, FiMenu, FiX } from "react-icons/fi";
import { LookupMode } from "@/routes/LookupMode";
import { TestMode } from "@/routes/TestMode";
import { StatsMode } from "@/routes/StatsMode";

type AppMode = "lookup" | "test" | "stats";

function App() {
  const [mode, setMode] = useState<AppMode>("lookup");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting a mode
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/darts-checkout-trainer/logo.svg" 
                alt="Darts Checkout Trainer Logo" 
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Checkout Trainer
              </h1>
            </div>
            {/* Desktop Navigation - hidden on mobile */}
            <nav className="hidden sm:flex items-center gap-6">
              <button
                onClick={() => setMode("lookup")}
                className={`flex items-center gap-2 font-medium transition-all focus:outline-none ${
                  mode === "lookup"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FiSearch size={20} />
                <span>Lookup</span>
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
                <span>Test</span>
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
                <span>Stats</span>
              </button>
            </nav>

            {/* Mobile Menu Button - only visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - only visible on mobile when open */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-gray-900">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="bg-gray-800 shadow-lg border-b border-gray-700">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/darts-checkout-trainer/logo.svg" 
                      alt="Darts Checkout Trainer Logo" 
                      className="w-8 h-8"
                    />
                    <h1 className="text-2xl font-bold text-white">
                      Checkout Trainer
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 flex flex-col justify-center px-6">
              <nav className="space-y-8">
                <button
                  onClick={() => handleModeChange("lookup")}
                  className={`w-full flex items-center justify-center gap-4 py-6 text-2xl font-medium transition-all focus:outline-none ${
                    mode === "lookup"
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <FiSearch size={32} />
                  <span>Lookup</span>
                </button>
                <button
                  onClick={() => handleModeChange("test")}
                  className={`w-full flex items-center justify-center gap-4 py-6 text-2xl font-medium transition-all focus:outline-none ${
                    mode === "test"
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <FiTarget size={32} />
                  <span>Test</span>
                </button>
                <button
                  onClick={() => handleModeChange("stats")}
                  className={`w-full flex items-center justify-center gap-4 py-6 text-2xl font-medium transition-all focus:outline-none ${
                    mode === "stats"
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <FiBarChart2 size={32} />
                  <span>Stats</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <main className="py-8">
        {mode === "lookup" && <LookupMode key="lookup" />}
        {mode === "test" && <TestMode key="test" />}
        {mode === "stats" && <StatsMode key="stats" />}
      </main>
    </div>
  );
}

export default App;
