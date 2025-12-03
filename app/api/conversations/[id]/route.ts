import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/conversations/[id] - Get conversation details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT 
        id,
        session_id,
        user_id,
        title,
        created_at,
        updated_at,
        is_active
      FROM conversations
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching conversation:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

// PATCH /api/conversations/[id] - Update conversation
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const result = await query(
      `UPDATE conversations
       SET title = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, session_id, user_id, title, created_at, updated_at`,
      [title, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    console.log("✅ Updated conversation:", result.rows[0]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating conversation:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
