import { track } from "@vercel/analytics";
import { AnalyticsEvent } from "@/types";

export class AnalyticsService {
  private static getSessionId(): string {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("sessionId") || "unknown";
    }
    return "unknown";
  }

  static trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (process.env.NODE_ENV === "production") {
      const eventData: AnalyticsEvent = {
        eventName,
        properties,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString(),
      };

      track(eventName, {
        ...eventData.properties,
        sessionId: eventData.sessionId || "unknown",
        timestamp: eventData.timestamp || new Date().toISOString(),
      });
    }
  }

  static trackPageView(page: string, title?: string): void {
    this.trackEvent("page_view", {
      page,
      title: title || document.title,
    });
  }

  static trackChatEvent(
    eventName: string,
    properties?: Record<string, any>
  ): void {
    this.trackEvent(eventName, properties);
  }

  static trackChatSessionStart(sessionId: string): void {
    this.trackEvent("chat_session_started", { sessionId });
  }

  static trackMessageSent(messageLength: number, sessionId: string): void {
    this.trackEvent("chat_message_sent", { messageLength, sessionId });
  }

  static trackResponseReceived(
    hasComponents: boolean,
    isMarkdown: boolean,
    responseLength: number | string,
    sessionId: string
  ): void {
    this.trackEvent("chat_response_received", {
      hasComponents,
      isMarkdown,
      responseLength,
      sessionId,
    });
  }

  static trackError(error: string, sessionId: string): void {
    this.trackEvent("chat_error", { error, sessionId });
  }
}
