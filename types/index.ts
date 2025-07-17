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
  CliCod: number;
  PrdCod: number;
  Email: string;
  userName: string;
  token: string;
  iframeWidth?: number;
  // New fields from JWT
  tokenPayload?: JWTPayload;
}

export interface ChatMetadata {
  CliCod: number;
  PrdCod: number;
  Email: string;
  userName: string;
  timestamp: string;
  sessionId: string;
  // New fields from JWT token
  IdUser?: string;
  Document?: string;
  FirstName?: string;
  LastName?: string;
  role?: string;
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
  userData: UserData;
  isDataReceived: boolean;
  sendMessageToParent: (message: any) => void;
}

export interface ConversationHistory {
  id: string;
  text: string;
  date: Date;
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
