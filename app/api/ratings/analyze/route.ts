import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface AnalysisResult {
  summary: string;
  mainIssues: { category: string; count: number; description: string }[];
  recommendations: string[];
  patterns: string[];
  overallAssessment: string;
}

async function analyzeWithGemini(ratings: any[]): Promise<AnalysisResult> {
  const negativeRatings = ratings.filter((r) => r.rating === "negative");

  if (negativeRatings.length === 0) {
    return {
      summary: "No hay calificaciones negativas para analizar.",
      mainIssues: [],
      recommendations: ["Continúa monitoreando las respuestas del chatbot."],
      patterns: [],
      overallAssessment: "El sistema está funcionando bien.",
    };
  }

  // Prepare data for analysis
  const dataForAnalysis = negativeRatings.map((r) => ({
    question: r.user_question || "Sin pregunta",
    response: r.message_content ? r.message_content.substring(0, 300) : "Sin respuesta",
    feedback: r.feedback_text || "Sin feedback específico",
  }));

  const prompt = `Eres un analista de calidad para un sistema RAG (Retrieval-Augmented Generation) de un chatbot de soporte.

Analiza las siguientes calificaciones negativas de usuarios y proporciona un análisis estructurado:

DATOS DE CALIFICACIONES NEGATIVAS:
${JSON.stringify(dataForAnalysis, null, 2)}

Responde en formato JSON con la siguiente estructura exacta (sin markdown, solo JSON puro):
{
  "summary": "Resumen ejecutivo de 2-3 oraciones sobre los problemas encontrados",
  "mainIssues": [
    {
      "category": "Nombre de la categoría del problema",
      "count": número estimado de ocurrencias,
      "description": "Descripción breve del problema"
    }
  ],
  "recommendations": ["Recomendación 1", "Recomendación 2", "..."],
  "patterns": ["Patrón 1 detectado", "Patrón 2 detectado"],
  "overallAssessment": "Evaluación general del estado del sistema RAG"
}

Enfócate en:
1. Identificar categorías de problemas comunes
2. Detectar patrones o temas recurrentes
3. Dar recomendaciones accionables para mejorar
4. Ser específico sobre qué tipos de preguntas o temas tienen más problemas`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      throw new Error("Error en la API de Gemini");
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error("No se recibió respuesta de Gemini");
    }

    // Parse JSON from response (removing any markdown code blocks if present)
    const cleanJson = textContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const analysis = JSON.parse(cleanJson);

    return analysis as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    return {
      summary: "Error al analizar con IA. Por favor intenta de nuevo.",
      mainIssues: [],
      recommendations: ["Revisar manualmente las calificaciones negativas."],
      patterns: [],
      overallAssessment: "No se pudo completar el análisis automático.",
    };
  }
}

export async function GET() {
  try {
    // Get all recent ratings for analysis
    const ratingsQuery = await pool.query(`
      SELECT * FROM response_ratings
      WHERE created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 100
    `);

    const ratings = ratingsQuery.rows;

    // Get basic stats
    const totalRatings = ratings.length;
    const negativeRatings = ratings.filter((r) => r.rating === "negative").length;
    const positiveRatings = ratings.filter((r) => r.rating === "positive").length;

    // Analyze with AI
    const aiAnalysis = await analyzeWithGemini(ratings);

    // Extract feedback categories
    const feedbackCategories: Record<string, number> = {};
    ratings.forEach((r) => {
      if (r.feedback_text) {
        const match = r.feedback_text.match(/\[(.*?)\]/);
        if (match) {
          feedbackCategories[match[1]] = (feedbackCategories[match[1]] || 0) + 1;
        }
      }
    });

    return NextResponse.json({
      stats: {
        totalAnalyzed: totalRatings,
        negativeCount: negativeRatings,
        positiveCount: positiveRatings,
        satisfactionRate: totalRatings > 0 ? Math.round((positiveRatings / totalRatings) * 100) : 0,
      },
      feedbackCategories: Object.entries(feedbackCategories)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
      aiAnalysis,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in AI analysis:", error);
    return NextResponse.json({ error: "Error al realizar análisis" }, { status: 500 });
  }
}
