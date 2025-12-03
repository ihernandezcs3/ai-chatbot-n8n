import { useState, useEffect, useCallback } from "react";
import { ConversationHistory } from "@/types";
import { ConversationService } from "@/app/services/conversationService";

export const useConversationHistory = (userId?: string) => {
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Load conversations when userId changes
  useEffect(() => {
    if (userId) {
      loadConversations(userId);
    } else {
      setConversations([]);
      setLoading(false);
    }
  }, [userId]);

  const loadConversations = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ConversationService.getConversations(uid);
      setConversations(data);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("No se pudieron cargar las conversaciones");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = useCallback(() => {
    // Clear selected conversation to start fresh
    setSelectedConversationId(null);
    console.log("Nueva conversación iniciada");
  }, []);

  const handleSelectConversation = useCallback((conversationId: string, title: string) => {
    setSelectedConversationId(conversationId);
    console.log(`Conversación seleccionada: ${title} (ID: ${conversationId})`);
  }, []);

  const refreshConversations = useCallback(() => {
    if (userId) {
      loadConversations(userId);
    }
  }, [userId]);

  return {
    conversations,
    loading,
    error,
    selectedConversationId,
    handleNewChat,
    handleSelectConversation,
    refreshConversations,
  };
};
