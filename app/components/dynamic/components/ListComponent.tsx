"use client";

interface ListComponentProps {
  items: string[];
  type?: "ul" | "ol";
  className?: string;
}

export function ListComponent({
  items,
  type = "ul",
  className = "",
}: ListComponentProps) {
  const Tag = type as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`${
        type === "ol" ? "list-decimal" : "list-disc"
      } list-inside space-y-1 ${className}`}
    >
      {items.map((item, index) => (
        <li key={index} className="text-sm">
          {item}
        </li>
      ))}
    </Tag>
  );
}
