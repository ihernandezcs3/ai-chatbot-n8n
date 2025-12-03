export type SuggestionType = "question" | "action" | "suggestion" | "help";

export interface Suggestion {
  id: string;
  text: string;
  type: SuggestionType;
  category?: string;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface SuggestionPayload {
  suggestions: Suggestion[];
  sessionId?: string;
  userId?: string;
  timestamp?: string;
}

export interface SuggestionResponse {
  success: boolean;
  message: string;
  receivedCount: number;
}
