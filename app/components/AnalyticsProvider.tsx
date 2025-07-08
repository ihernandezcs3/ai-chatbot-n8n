"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Track page view when component mounts
    track("page_view", {
      page: window.location.pathname,
      title: document.title,
    });
  }, []);

  // Function to track chat events
  const trackChatEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    track(eventName, {
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem("sessionId") || "unknown",
      ...properties,
    });
  };

  // Expose tracking function globally for use in other components
  useEffect(() => {
    (window as any).trackChatEvent = trackChatEvent;
  }, []);

  return <>{children}</>;
}

// Export the tracking function for use in other components
export const trackChatEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  track(eventName, {
    timestamp: new Date().toISOString(),
    sessionId: sessionStorage.getItem("sessionId") || "unknown",
    ...properties,
  });
};
