import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { RatingData } from "@/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// POST - Submit a new rating
export async function POST(request: NextRequest) {
  try {
    const body: RatingData = await request.json();
    const { sessionId, messageId, userId, rating, feedbackText, messageContent, userQuestion } = body;

    if (!sessionId || !messageId || !userId || !rating) {
      return NextResponse.json({ error: "sessionId, messageId, userId, and rating are required" }, { status: 400 });
    }

    if (rating !== "positive" && rating !== "negative") {
      return NextResponse.json({ error: "rating must be 'positive' or 'negative'" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO response_ratings 
       (session_id, message_id, user_id, rating, feedback_text, message_content, user_question)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (session_id, message_id, user_id) 
       DO UPDATE SET rating = $4, feedback_text = $5, created_at = NOW()
       RETURNING *`,
      [sessionId, messageId, userId, rating, feedbackText || null, messageContent || null, userQuestion || null]
    );

    console.log("✅ Rating saved:", { sessionId, messageId, rating });

    return NextResponse.json({ success: true, rating: result.rows[0] });
  } catch (error) {
    console.error("❌ Error saving rating:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Get ratings (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = "SELECT * FROM response_ratings";
    const params: string[] = [];

    if (sessionId) {
      query += " WHERE session_id = $1";
      params.push(sessionId);
    }

    query += " ORDER BY created_at DESC LIMIT $" + (params.length + 1);
    params.push(limit.toString());

    const result = await pool.query(query, params);

    return NextResponse.json({ ratings: result.rows });
  } catch (error) {
    console.error("❌ Error fetching ratings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
