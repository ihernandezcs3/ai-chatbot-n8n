"use client";

interface TextComponentProps {
  content: string;
  className?: string;
}

export function TextComponent({ content, className = "" }: TextComponentProps) {
  return <p className={`text-sm ${className}`}>{content}</p>;
}
