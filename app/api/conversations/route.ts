import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/conversations?userId=X - List conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Query conversations for the user, ordered by most recent
    const result = await query(
      `SELECT 
        c.id,
        c.session_id,
        c.title,
        c.created_at,
        c.updated_at,
        COUNT(m.id) as message_count
      FROM conversations c
      LEFT JOIN n8n_chat_histories m ON c.session_id = m.session_id
      WHERE c.user_id = $1 AND c.is_active = true
      GROUP BY c.id, c.session_id, c.title, c.created_at, c.updated_at
      ORDER BY c.updated_at DESC
      LIMIT 50`,
      [userId]
    );

    return NextResponse.json({
      conversations: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, title } = body;

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "sessionId and userId are required" }, { status: 400 });
    }

    // Insert new conversation
    const result = await query(
      `INSERT INTO conversations (session_id, user_id, title)
       VALUES ($1, $2, $3)
       RETURNING id, session_id, user_id, title, created_at, updated_at`,
      [sessionId, userId, title || "Nueva conversación"]
    );

    console.log("✅ Created conversation:", result.rows[0]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating conversation:", error);

    // Handle duplicate session_id
    if (error.code === "23505") {
      return NextResponse.json({ error: "Conversation with this sessionId already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
