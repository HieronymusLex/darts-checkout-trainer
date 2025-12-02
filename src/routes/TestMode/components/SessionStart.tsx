import { Button } from "@/components/Button";

interface SessionStartProps {
  onStart: () => void;
}

export const SessionStart = ({ onStart }: SessionStartProps) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-800 border border-gray-700 rounded shadow-lg p-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to Practice?
        </h3>
        <p className="text-gray-400 mb-8">
          Click start to begin your training session. Your score and average
          time will be tracked.
        </p>
        <Button onClick={onStart} variant="primary" size="lg">
          Start Session
        </Button>
      </div>
    </div>
  );
};
