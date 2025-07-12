export type QuickAnswerType =
  | "question"
  | "answer"
  | "confirmation"
  | "negation"
  | "suggestion"
  | "action"
  | "help";

export interface QuickAnswer {
  id: string;
  text: string;
  type: QuickAnswerType;
  category?: string;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface QuickAnswerPayload {
  quickAnswers: QuickAnswer[];
  sessionId?: string;
  userId?: string;
  timestamp?: string;
}

export interface QuickAnswerResponse {
  success: boolean;
  message: string;
  receivedCount: number;
}
