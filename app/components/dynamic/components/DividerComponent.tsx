"use client";

interface DividerComponentProps {
  className?: string;
}

export function DividerComponent({ className = "" }: DividerComponentProps) {
  return <hr className={`border-gray-200 my-4 ${className}`} />;
}
