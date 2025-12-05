import { ChatApiRequest, ChatApiResponse, ChatMetadata, UserData } from "@/types";
import { TokenService } from "./tokenService";

export class ChatService {
  private static readonly API_ENDPOINT = "/api/chat";

  static async sendMessage(sessionId: string, content: string, userData: UserData): Promise<ChatApiResponse> {
    const metadata: ChatMetadata = {
      // Datos del iframe
      CliCod: userData.CliCod,
      PrdCod: userData.PrdCod,
      // Datos de la sesión
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      domain: typeof window !== "undefined" ? window.location.origin : undefined,
      // Datos del JWT (exactamente como vienen)
      IdUser: userData.IdUser,
      unique_name: userData.unique_name,
      Document: userData.Document,
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      email: userData.email,
      role: userData.role,
      nbf: userData.nbf,
      exp: userData.exp,
      iat: userData.iat,
    };

    const requestBody: ChatApiRequest = {
      sessionId,
      chatInput: content.trim(),
      metadata,
    };

    const response = await fetch(this.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  static generateSessionId(): string {
    return `session_${Math.random().toString(36).substr(2, 9)}`;
  }

  static containsMarkdown(content: string): boolean {
    const markdownPatterns = [
      /^#{1,6}\s/, // Headers
      /\*\*.*\*\*/, // Bold
      /\*.*\*/, // Italic
      /\[.*\]\(.*\)/, // Links
      /```[\s\S]*```/, // Code blocks
      /`.*`/, // Inline code
      /^\s*[-*+]\s/, // Unordered lists
      /^\s*\d+\.\s/, // Ordered lists
      /^\s*>\s/, // Blockquotes
      /\|.*\|.*\|/, // Tables
      /~~.*~~/, // Strikethrough
      /^\s*- \[ \]/, // Task lists
    ];

    return markdownPatterns.some((pattern) => pattern.test(content));
  }
}
