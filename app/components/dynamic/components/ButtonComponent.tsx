"use client";

interface ButtonComponentProps {
  label: string;
  action: string;
  variant?: string;
  className?: string;
}

export function ButtonComponent({
  label,
  action,
  variant = "primary",
  className = "",
}: ButtonComponentProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      className={`${baseClasses} ${
        variantClasses[variant as keyof typeof variantClasses]
      } ${className}`}
      onClick={() => {
        if (action.startsWith("http")) {
          window.open(action, "_blank");
        } else {
          console.log("Action:", action);
        }
      }}
    >
      {label}
    </button>
  );
}
