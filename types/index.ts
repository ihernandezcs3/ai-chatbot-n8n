// Chat related types
export interface Message {
  id: string;
  content: string | ComponentData[];
  isUser: boolean;
  timestamp: Date;
  hasComponents?: boolean;
  isMarkdown?: boolean;
  actions?: any[];
}

// JWT Token payload structure
export interface JWTPayload {
  IdUser: string;
  unique_name: string;
  Document: string;
  FirstName: string;
  LastName: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
}

export interface UserData {
  // Datos del iframe
  CliCod: number;
  PrdCod: number;
  token: string;
  // Datos del JWT (exactamente como vienen)
  IdUser?: string;
  unique_name?: string;
  Document?: string;
  FirstName?: string;
  LastName?: string;
  email?: string;
  role?: string;
  nbf?: number;
  exp?: number;
  iat?: number;
}

export interface ChatMetadata {
  // Datos del iframe
  CliCod: number;
  PrdCod: number;
  // Datos de la sesión
  timestamp: string;
  sessionId: string;
  domain?: string;
  // Datos del JWT (exactamente como vienen)
  IdUser?: string;
  unique_name?: string;
  Document?: string;
  FirstName?: string;
  LastName?: string;
  email?: string;
  role?: string;
  nbf?: number;
  exp?: number;
  iat?: number;
}

// Component related types
export interface ComponentData {
  type: string;
  props?: Record<string, any>;
  content?: string;
  children?: ComponentData[];
}

// Analytics related types
export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  sessionId?: string;
  timestamp?: string;
}

// UI related types
export interface ChatInterfaceProps {
  userData: UserData | null;
  isDataReceived: boolean;
  sendMessageToParent: (message: any) => void;
  conversationId?: string | null;
  onConversationCreated?: () => void;
}

export interface ConversationHistory {
  id: string;
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

// API related types
export interface ChatApiRequest {
  sessionId: string;
  chatInput: string;
  metadata: ChatMetadata;
}

export interface ChatApiResponse {
  output: string;
  components?: ComponentData[];
  actions?: any[];
}

// Hook related types
export interface UseMessagesReturn {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  sessionId: string;
}

// Token info interface
export interface TokenInfo {
  user: string;
  email: string;
  role: string;
  userId: string;
  issuedAt: Date | null;
  expiresAt: Date | null;
  timeUntilExpiration: number | null;
  isValid: boolean;
  isExpired: boolean;
}

// Suggestion types
export * from "./Suggestion";

// Rating System types
export interface RatingData {
  sessionId: string;
  messageId: string;
  userId: string;
  rating: "positive" | "negative";
  feedbackText?: string;
  messageContent?: string;
  userQuestion?: string;
}

export interface RatingResponse {
  id: string;
  session_id: string;
  message_id: string;
  user_id: string;
  rating: "positive" | "negative";
  feedback_text?: string;
  message_content?: string;
  user_question?: string;
  created_at: string;
}

export interface DashboardStats {
  totalRatings: number;
  positiveRatings: number;
  negativeRatings: number;
  satisfactionRate: number;
  totalConversations: number;
  avgRatingsPerConversation: number;
  ratingsByDay: { date: string; positive: number; negative: number }[];
  recentRatings: RatingResponse[];
  topNegativeQuestions: { question: string; count: number }[];
}
