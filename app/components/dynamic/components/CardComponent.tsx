"use client";

import { ComponentData } from "@/types";
import DynamicComponentRenderer from "../../DynamicComponentRenderer";

interface CardComponentProps {
  title?: string;
  content?: string;
  children?: ComponentData[];
  className?: string;
}

export function CardComponent({
  title,
  content,
  children,
  className = "",
}: CardComponentProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}
    >
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {content && <p className="text-sm text-gray-600 mb-3">{content}</p>}
      {children && (
        <div className="space-y-2">
          {children.map((child, index) => (
            <DynamicComponentRenderer key={index} data={child} />
          ))}
        </div>
      )}
    </div>
  );
}
