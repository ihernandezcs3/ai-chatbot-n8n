"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Send,
  FileText,
  Image,
  Video,
  Link,
  Download,
  ExternalLink,
} from "lucide-react";

interface ComponentData {
  type: string;
  props?: Record<string, any>;
  content?: string;
  children?: ComponentData[];
}

interface DynamicComponentRendererProps {
  data: ComponentData;
}

// Component registry - add new components here
const componentRegistry: Record<string, React.ComponentType<any>> = {
  text: ({
    content,
    className = "",
  }: {
    content: string;
    className?: string;
  }) => <p className={`text-sm ${className}`}>{content}</p>,

  heading: ({
    level = 1,
    content,
    className = "",
  }: {
    level: number;
    content: string;
    className?: string;
  }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={`font-semibold ${className}`}>{content}</Tag>;
  },

  button: ({
    label,
    action,
    variant = "primary",
    className = "",
  }: {
    label: string;
    action: string;
    variant?: string;
    className?: string;
  }) => {
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
  },

  link: ({
    url,
    text,
    className = "",
  }: {
    url: string;
    text: string;
    className?: string;
  }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 hover:text-blue-800 underline ${className}`}
    >
      {text} <ExternalLink className="inline w-4 h-4" />
    </a>
  ),

  image: ({
    src,
    alt,
    width,
    height,
    className = "",
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
    />
  ),

  card: ({
    title,
    content,
    children,
    className = "",
  }: {
    title?: string;
    content?: string;
    children?: ComponentData[];
    className?: string;
  }) => (
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
  ),

  list: ({
    items,
    type = "ul",
    className = "",
  }: {
    items: string[];
    type?: "ul" | "ol";
    className?: string;
  }) => {
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
  },

  divider: ({ className = "" }: { className?: string }) => (
    <hr className={`border-gray-200 my-4 ${className}`} />
  ),

  badge: ({
    text,
    variant = "default",
    className = "",
  }: {
    text: string;
    variant?: string;
    className?: string;
  }) => {
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
  },

  code: ({
    content,
    language,
    className = "",
  }: {
    content: string;
    language?: string;
    className?: string;
  }) => (
    <pre
      className={`bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm ${className}`}
    >
      <code>{content}</code>
    </pre>
  ),

  table: ({
    headers,
    rows,
    className = "",
  }: {
    headers: string[];
    rows: string[][];
    className?: string;
  }) => (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-200 px-4 py-2 text-left text-sm font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-200 px-4 py-2 text-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export default function DynamicComponentRenderer({
  data,
}: DynamicComponentRendererProps) {
  const Component = componentRegistry[data.type];

  if (!Component) {
    console.warn(`Unknown component type: ${data.type}`);
    return (
      <div className="text-red-500 text-sm">Unknown component: {data.type}</div>
    );
  }

  return (
    <Component
      {...data.props}
      content={data.content}
      children={data.children}
    />
  );
}
