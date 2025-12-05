import { useState, useCallback, useEffect } from "react";
import { Message, UseChatReturn, UserData, ComponentData } from "@/types";
import { ChatService } from "@/app/services/chatService";
import { AnalyticsService } from "@/app/services/analyticsService";
import { ConversationService } from "@/app/services/conversationService";
import { useMessages } from "./useMessages";

export const useChat = (userData: UserData | null, existingConversationId?: string | null, onConversationCreated?: () => void, initialSessionId?: string): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  // Usar el sessionId inicial si se proporciona (modo standalone)
  const [sessionId, setSessionId] = useState<string>(() => initialSessionId || ChatService.generateSessionId());
  const [conversationId, setConversationId] = useState<string | null>(existingConversationId || null);
  const { messages, addMessage, clearMessages } = useMessages();

  // Track session start
  useEffect(() => {
    AnalyticsService.trackChatSessionStart(sessionId);
  }, [sessionId]);

  // Load existing conversation if provided
  useEffect(() => {
    if (existingConversationId && userData?.IdUser) {
      loadExistingConversation(existingConversationId);
    } else if (existingConversationId === null && conversationId !== null) {
      // User clicked "New Chat" - reset everything
      clearMessages();
      setConversationId(null);
      const newSessionId = ChatService.generateSessionId();
      setSessionId(newSessionId);
      console.log("🆕 Started new conversation with sessionId:", newSessionId);
    }
  }, [existingConversationId, userData?.IdUser]);

  const loadExistingConversation = async (convId: string) => {
    try {
      setIsLoading(true);

      // Get conversation details
      const conversation = await ConversationService.getConversation(convId);
      setSessionId(conversation.session_id);
      setConversationId(conversation.id);

      // Get messages
      const { messages: conversationMessages } = await ConversationService.getConversationMessages(convId);

      // Clear current messages and load from conversation
      clearMessages();

      conversationMessages.forEach((msg, idx) => {
        const message: Message = {
          id: `${convId}-${idx}`,
          content: msg.content,
          isUser: msg.type === "human",
          timestamp: new Date(msg.timestamp),
        };
        addMessage(message);
      });

      console.log(`✅ Loaded conversation with ${conversationMessages.length} messages`);
    } catch (error) {
      console.error("❌ Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Create conversation on first message if not exists
      if (!conversationId && userData?.IdUser) {
        try {
          const title = content.trim().substring(0, 100);
          const conversation = await ConversationService.createConversation(sessionId, userData.IdUser, title);
          setConversationId(conversation.id);
          console.log("✅ Conversation created:", conversation.id);
          if (onConversationCreated) onConversationCreated();
        } catch (error) {
          console.error("⚠️ Could not create conversation, continuing anyway:", error);
        }
      }

      try {
        // Send message to API
        if (!userData) {
          throw new Error("No hay datos de usuario disponibles");
        }
        const response = await ChatService.sendMessage(sessionId, content, userData);

        // Check if response contains components
        const hasComponents = response.components && Array.isArray(response.components);
        const messageContent = hasComponents ? response.components : response.output;

        // Check if content contains markdown
        const isMarkdown = typeof messageContent === "string" && ChatService.containsMarkdown(messageContent);

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
        AnalyticsService.trackResponseReceived(hasComponents || false, isMarkdown || false, typeof messageContent === "string" ? messageContent.length : "component", sessionId);
      } catch (error) {
        console.error("Error sending message:", error);

        // Track error
        AnalyticsService.trackError(error instanceof Error ? error.message : "Unknown error", sessionId);

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
