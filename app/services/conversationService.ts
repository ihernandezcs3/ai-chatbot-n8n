/**
 * Conversation Service
 * Handles all API calls related to conversation management
 */

export interface Conversation {
  id: string;
  session_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface ConversationMessage {
  type: "human" | "ai";
  content: string;
  timestamp: Date;
}

export interface ConversationMessagesResponse {
  sessionId: string;
  messages: ConversationMessage[];
}

export class ConversationService {
  /**
   * Create a new conversation
   */
  static async createConversation(sessionId: string, userId: string, title?: string): Promise<Conversation> {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          title: title || "Nueva conversación",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`);
      }

      const conversation = await response.json();
      console.log("✅ Conversation created:", conversation);
      return conversation;
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   */
  static async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`/api/conversations?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Fetched ${data.conversations.length} conversations`);
      return data.conversations;
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
      throw error;
    }
  }

  /**
   * Get a specific conversation by ID
   */
  static async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.statusText}`);
      }

      const conversation = await response.json();
      console.log("✅ Fetched conversation:", conversation);
      return conversation;
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
      throw error;
    }
  }

  /**
   * Get messages for a conversation
   */
  static async getConversationMessages(conversationId: string): Promise<ConversationMessagesResponse> {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Fetched ${data.messages.length} messages`);
      return data;
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      throw error;
    }
  }

  /**
   * Update conversation title
   */
  static async updateConversation(conversationId: string, title: string): Promise<Conversation> {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.statusText}`);
      }

      const conversation = await response.json();
      console.log("✅ Conversation updated:", conversation);
      return conversation;
    } catch (error) {
      console.error("❌ Error updating conversation:", error);
      throw error;
    }
  }
}
