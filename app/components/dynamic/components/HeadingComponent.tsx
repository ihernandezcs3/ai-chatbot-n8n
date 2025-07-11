"use client";

interface HeadingComponentProps {
  level?: number;
  content: string;
  className?: string;
}

export function HeadingComponent({
  level = 1,
  content,
  className = "",
}: HeadingComponentProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`font-semibold ${className}`}>{content}</Tag>;
}
