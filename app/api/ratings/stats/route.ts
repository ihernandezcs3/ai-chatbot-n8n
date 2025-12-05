import { NextResponse } from "next/server";
import { Pool } from "pg";
import { DashboardStats } from "@/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    // Get total ratings count
    const totalQuery = await pool.query("SELECT COUNT(*) as total FROM response_ratings");
    const totalRatings = parseInt(totalQuery.rows[0].total);

    // Get positive/negative counts
    const ratingCounts = await pool.query(`
      SELECT rating, COUNT(*) as count 
      FROM response_ratings 
      GROUP BY rating
    `);

    let positiveRatings = 0;
    let negativeRatings = 0;
    ratingCounts.rows.forEach((row: { rating: string; count: string }) => {
      if (row.rating === "positive") positiveRatings = parseInt(row.count);
      if (row.rating === "negative") negativeRatings = parseInt(row.count);
    });

    // Calculate satisfaction rate
    const satisfactionRate = totalRatings > 0 ? Math.round((positiveRatings / totalRatings) * 100) : 0;

    // Get total unique conversations with ratings
    const conversationsQuery = await pool.query(`
      SELECT COUNT(DISTINCT session_id) as total FROM response_ratings
    `);
    const totalConversations = parseInt(conversationsQuery.rows[0].total);

    // Average ratings per conversation
    const avgRatingsPerConversation = totalConversations > 0 ? Math.round((totalRatings / totalConversations) * 10) / 10 : 0;

    // Get ratings by day (last 7 days)
    const ratingsByDayQuery = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN rating = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN rating = 'negative' THEN 1 ELSE 0 END) as negative
      FROM response_ratings
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const ratingsByDay = ratingsByDayQuery.rows.map((row: { date: string; positive: string; negative: string }) => ({
      date: row.date,
      positive: parseInt(row.positive),
      negative: parseInt(row.negative),
    }));

    // Get recent ratings (last 50 for detailed view)
    const recentRatingsQuery = await pool.query(`
      SELECT * FROM response_ratings
      ORDER BY created_at DESC
      LIMIT 50
    `);

    // Get top negative questions (most common issues)
    const topNegativeQuery = await pool.query(`
      SELECT user_question as question, COUNT(*) as count
      FROM response_ratings
      WHERE rating = 'negative' AND user_question IS NOT NULL
      GROUP BY user_question
      ORDER BY count DESC
      LIMIT 5
    `);

    const topNegativeQuestions = topNegativeQuery.rows.map((row: { question: string; count: string }) => ({
      question: row.question,
      count: parseInt(row.count),
    }));

    const stats: DashboardStats = {
      totalRatings,
      positiveRatings,
      negativeRatings,
      satisfactionRate,
      totalConversations,
      avgRatingsPerConversation,
      ratingsByDay,
      recentRatings: recentRatingsQuery.rows,
      topNegativeQuestions,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
