interface ModifierButtonProps {
  label: string;
  shortcut: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
  variant: "single" | "double" | "triple";
}

const variantStyles = {
  single: {
    active: "bg-gray-600 text-white shadow-md focus:ring-gray-500",
    inactive:
      "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-400 border border-gray-600",
  },
  double: {
    active: "bg-blue-600 text-white shadow-md focus:ring-blue-500",
    inactive:
      "bg-blue-900 text-blue-300 hover:bg-blue-800 focus:ring-blue-400 border border-blue-800",
  },
  triple: {
    active: "bg-green-600 text-white shadow-md focus:ring-green-500",
    inactive:
      "bg-green-900 text-green-300 hover:bg-green-800 focus:ring-green-400 border border-green-800",
  },
};

export const ModifierButton = ({
  label,
  shortcut,
  isActive,
  onClick,
  disabled,
  variant,
}: ModifierButtonProps) => {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-3 rounded font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        disabled
          ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
          : isActive
          ? styles.active
          : styles.inactive
      }`}
    >
      {label} <span className="text-xs opacity-75">({shortcut})</span>
    </button>
  );
};
