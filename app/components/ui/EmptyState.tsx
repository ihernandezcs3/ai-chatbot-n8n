"use client";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "¿En qué puedo ayudarte?" }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center animate-text-shimmer">{message}</h2>
    </div>
  );
}
