"use client";

import { useEffect } from "react";
import { AnalyticsService } from "@/app/services/analyticsService";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Track page view on mount
    if (typeof window !== "undefined") {
      AnalyticsService.trackPageView(window.location.pathname, document.title);
    }
  }, []);

  return <>{children}</>;
}
