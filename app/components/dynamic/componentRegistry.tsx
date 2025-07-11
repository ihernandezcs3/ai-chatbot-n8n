"use client";

import { ComponentData } from "@/types";
import { ExternalLink } from "lucide-react";

// Import individual component definitions
import { TextComponent } from "./components/TextComponent";
import { HeadingComponent } from "./components/HeadingComponent";
import { ButtonComponent } from "./components/ButtonComponent";
import { LinkComponent } from "./components/LinkComponent";
import { ImageComponent } from "./components/ImageComponent";
import { CardComponent } from "./components/CardComponent";
import { ListComponent } from "./components/ListComponent";
import { DividerComponent } from "./components/DividerComponent";
import { BadgeComponent } from "./components/BadgeComponent";
import { CodeComponent } from "./components/CodeComponent";
import { TableComponent } from "./components/TableComponent";

// Component registry - add new components here
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  text: TextComponent,
  heading: HeadingComponent,
  button: ButtonComponent,
  link: LinkComponent,
  image: ImageComponent,
  card: CardComponent,
  list: ListComponent,
  divider: DividerComponent,
  badge: BadgeComponent,
  code: CodeComponent,
  table: TableComponent,
};

// Helper function to get component from registry
export function getComponent(type: string): React.ComponentType<any> | null {
  return componentRegistry[type] || null;
}
