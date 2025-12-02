import { useEffect } from "react";

export const useKeyPress = (
  key: string,
  callback: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [key, callback, enabled]);
};
