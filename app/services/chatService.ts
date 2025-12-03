import { ChatApiRequest, ChatApiResponse, ChatMetadata, UserData } from "@/types";
import { TokenService } from "./tokenService";

export class ChatService {
  private static readonly API_ENDPOINT = "/api/chat";

  static async sendMessage(sessionId: string, content: string, userData: UserData): Promise<ChatApiResponse> {
    // Extract data from token if available
    const tokenPayload = userData.tokenPayload;
    const tokenData = tokenPayload ? TokenService.extractUserDataFromToken(tokenPayload) : null;

    const metadata: ChatMetadata = {
      CliCod: userData?.CliCod || 20115,
      PrdCod: userData?.PrdCod || 4,
      Email: tokenData?.email || userData?.Email || "ihernandez@comercializadora-s3.com",
      userName: tokenData?.userName || userData?.userName || "Usuario",
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      // Add new fields from token
      IdUser: tokenData?.IdUser,
      Document: tokenData?.Document,
      FirstName: tokenData?.FirstName,
      LastName: tokenData?.LastName,
      role: tokenData?.role,
      // Domain from current origin
      domain: typeof window !== "undefined" ? window.location.origin : undefined,
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
