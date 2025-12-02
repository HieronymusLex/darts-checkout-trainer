import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      active = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-sm font-semibold transition-all outline-none focus:outline-none cursor-pointer disabled:cursor-not-allowed";

    const variantStyles = {
      primary: active
        ? "bg-blue-600 text-white shadow-md focus:ring-blue-500"
        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-[0.98] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border disabled:border-gray-600",
      secondary: active
        ? "bg-blue-600 text-white shadow-md focus:ring-blue-500"
        : "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600 shadow-sm hover:shadow-md disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-blue-500",
      danger:
        "bg-orange-900 text-orange-200 hover:bg-orange-800 focus:ring-orange-400 border border-orange-800 shadow-sm hover:shadow-md disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-600",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border disabled:border-gray-600",
      ghost:
        "text-gray-400 hover:text-white hover:bg-gray-700 focus:ring-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed",
    };

    const sizeStyles = {
      sm: "px-2 py-2 text-sm",
      md: "px-4 py-3",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
