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
    active: "bg-blue-600 text-white shadow-md focus:ring-blue-500",
    inactive:
      "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-blue-500 border border-gray-600",
  },
  double: {
    active: "bg-blue-600 text-white shadow-md focus:ring-blue-500",
    inactive:
      "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-blue-500 border border-gray-600",
  },
  triple: {
    active: "bg-blue-600 text-white shadow-md focus:ring-blue-500",
    inactive:
      "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-blue-500 border border-gray-600",
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
