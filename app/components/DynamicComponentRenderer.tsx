"use client";

import { ComponentData } from "@/types";
import { getComponent } from "./dynamic/componentRegistry";

interface DynamicComponentRendererProps {
  data: ComponentData;
}

export default function DynamicComponentRenderer({
  data,
}: DynamicComponentRendererProps) {
  const { type, props, content, children } = data;

  // Get component from registry
  const Component = getComponent(type);

  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return (
      <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
        Unknown component type: {type}
      </div>
    );
  }

  // Prepare component props
  const componentProps = {
    ...props,
    content,
    children,
  };

  return <Component {...componentProps} />;
}
