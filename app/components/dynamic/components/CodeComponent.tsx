"use client";

interface CodeComponentProps {
  content: string;
  language?: string;
  className?: string;
}

export function CodeComponent({
  content,
  language,
  className = "",
}: CodeComponentProps) {
  return (
    <pre
      className={`bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm ${className}`}
    >
      <code>{content}</code>
    </pre>
  );
}
