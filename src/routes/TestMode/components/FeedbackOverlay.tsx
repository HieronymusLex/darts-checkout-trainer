import { forwardRef } from "react";
import { Button } from "@/components/Button";

interface FeedbackOverlayProps {
  correct: boolean;
  message: string;
  onNext: () => void;
}

export const FeedbackOverlay = forwardRef<
  HTMLButtonElement,
  FeedbackOverlayProps
>(({ correct, message, onNext }, ref) => {
  return (
    <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center backdrop-blur-sm bg-gray-900/50 rounded">
      <div
        className={`p-6 rounded shadow-2xl max-w-md w-full ${
          correct
            ? "bg-green-900 border-2 border-green-600"
            : "bg-red-900 border-2 border-red-600"
        }`}
      >
        <p
          className={`font-bold text-lg text-center ${
            correct ? "text-green-100" : "text-red-100"
          }`}
        >
          {message}
        </p>
      </div>
      <Button
        ref={ref}
        onClick={onNext}
        variant="secondary"
        className="w-full max-w-md"
      >
        Next Question (Press Enter)
      </Button>
    </div>
  );
});

FeedbackOverlay.displayName = "FeedbackOverlay";
