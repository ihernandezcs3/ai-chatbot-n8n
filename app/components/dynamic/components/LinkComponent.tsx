"use client";

import { ExternalLink } from "lucide-react";

interface LinkComponentProps {
  url: string;
  text: string;
  className?: string;
}

export function LinkComponent({
  url,
  text,
  className = "",
}: LinkComponentProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 hover:text-blue-800 underline ${className}`}
    >
      {text} <ExternalLink className="inline w-4 h-4" />
    </a>
  );
}
