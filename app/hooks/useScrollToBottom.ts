import { useRef, useEffect } from "react";

export const useScrollToBottom = (dependency: any[]) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, dependency);

  return { elementRef, scrollToBottom };
};
