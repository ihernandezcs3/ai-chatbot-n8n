import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface RouteParams {
  params: {
    id: string;
  };
}

interface N8NMessage {
  type: string;
  content: string;
  additional_kwargs?: any;
  response_metadata?: any;
}

interface ParsedMessage {
  type: "human" | "ai";
  content: string;
  timestamp: Date;
}

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // First, get the conversation to retrieve session_id
    const convResult = await query("SELECT session_id FROM conversations WHERE id = $1", [id]);

    if (convResult.rows.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const sessionId = convResult.rows[0].session_id;

    // Query n8n_chat_histories for messages with this session_id
    const messagesResult = await query<{ id: number; message: N8NMessage }>(
      `SELECT id, message
       FROM n8n_chat_histories
       WHERE session_id = $1
       ORDER BY id ASC`,
      [sessionId]
    );

    // Parse the messages from n8n format
    const messages: ParsedMessage[] = messagesResult.rows.map((row: any, index: number) => {
      const msg = row.message;
      return {
        type: msg.type === "human" ? "human" : "ai",
        content: msg.content || "",
        timestamp: new Date(), // We don't have timestamp in n8n_chat_histories, so use current time
      };
    });

    console.log(`✅ Retrieved ${messages.length} messages for conversation ${id}`);

    return NextResponse.json({
      sessionId,
      messages,
    });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
