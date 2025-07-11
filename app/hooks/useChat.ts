import { useState, useCallback, useEffect } from "react";
import { Message, UseChatReturn, UserData, ComponentData } from "@/types";
import { ChatService } from "@/app/services/chatService";
import { AnalyticsService } from "@/app/services/analyticsService";
import { useMessages } from "./useMessages";

export const useChat = (userData: UserData): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => ChatService.generateSessionId());
  const { messages, addMessage } = useMessages();

  // Track session start
  useEffect(() => {
    AnalyticsService.trackChatSessionStart(sessionId);
  }, [sessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Track message sent
      AnalyticsService.trackMessageSent(content.trim().length, sessionId);

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      addMessage(userMessage);
      setIsLoading(true);

      try {
        // Send message to API
        const response = await ChatService.sendMessage(
          sessionId,
          content,
          userData
        );

        // Check if response contains components
        const hasComponents =
          response.components && Array.isArray(response.components);
        const messageContent = hasComponents
          ? response.components
          : response.output;

        // Check if content contains markdown
        const isMarkdown =
          typeof messageContent === "string" &&
          ChatService.containsMarkdown(messageContent);

        // Create bot message
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: messageContent || "No se recibió respuesta",
          isUser: false,
          timestamp: new Date(),
          hasComponents,
          isMarkdown,
          actions: response.actions,
        };

        addMessage(botMessage);

        // Track successful response
        AnalyticsService.trackResponseReceived(
          hasComponents || false,
          isMarkdown || false,
          typeof messageContent === "string"
            ? messageContent.length
            : "component",
          sessionId
        );
      } catch (error) {
        console.error("Error sending message:", error);

        // Track error
        AnalyticsService.trackError(
          error instanceof Error ? error.message : "Unknown error",
          sessionId
        );

        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Lo siento, encontré un error. Por favor intenta de nuevo.",
          isUser: false,
          timestamp: new Date(),
        };

        addMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [userData, sessionId, addMessage, isLoading]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    sessionId,
  };
};
