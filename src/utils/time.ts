export const formatTime = (milliseconds: number): string => {
  return (milliseconds / 1000).toFixed(1);
};

export const calculateAverageTime = (
  totalTime: number,
  count: number
): number => {
  return count > 0 ? totalTime / count : 0;
};
