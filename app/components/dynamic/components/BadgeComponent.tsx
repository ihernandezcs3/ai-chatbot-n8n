"use client";

interface BadgeComponentProps {
  text: string;
  variant?: string;
  className?: string;
}

export function BadgeComponent({
  text,
  variant = "default",
  className = "",
}: BadgeComponentProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        variantClasses[variant as keyof typeof variantClasses]
      } ${className}`}
    >
      {text}
    </span>
  );
}
