"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Users,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Bot,
  User,
  Clock,
  Tag,
  Sparkles,
  Lightbulb,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { RatingService } from "@/app/services/ratingService";
import { DashboardStats, RatingResponse } from "@/types";

// Tipo para el análisis de IA
interface AIAnalysis {
  stats: {
    totalAnalyzed: number;
    negativeCount: number;
    positiveCount: number;
    satisfactionRate: number;
  };
  feedbackCategories: { category: string; count: number }[];
  aiAnalysis: {
    summary: string;
    mainIssues: { category: string; count: number; description: string }[];
    recommendations: string[];
    patterns: string[];
    overallAssessment: string;
  };
  analyzedAt: string;
}

// Componente para mostrar el detalle expandible de un rating
function RatingDetailCard({ rating }: { rating: RatingResponse }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract feedback category from feedbackText (format: "[Category] details")
  const extractCategory = (text?: string) => {
    if (!text) return null;
    const match = text.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const extractDetails = (text?: string) => {
    if (!text) return null;
    return text.replace(/\[.*?\]\s*/, "").trim() || null;
  };

  const category = extractCategory(rating.feedback_text);
  const details = extractDetails(rating.feedback_text);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
      {/* Header - Always visible */}
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              rating.rating === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {rating.rating === "positive" ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 font-medium truncate">{rating.user_question || "Sin pregunta registrada"}</p>
            {category && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                <Tag className="w-3 h-3" />
                {category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(rating.created_at).toLocaleString("es", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 bg-gray-50">
          {/* User Question */}
          {rating.user_question && (
            <div className="pt-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                <User className="w-3 h-3" />
                Pregunta del usuario
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700">{rating.user_question}</p>
              </div>
            </div>
          )}

          {/* AI Response */}
          {rating.message_content && (
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                <Bot className="w-3 h-3" />
                Respuesta del asistente
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200 max-h-40 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {rating.message_content.length > 500 ? rating.message_content.substring(0, 500) + "..." : rating.message_content}
                </p>
              </div>
            </div>
          )}

          {/* Feedback Details */}
          {details && (
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                <MessageCircle className="w-3 h-3" />
                Comentario del usuario
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-sm text-amber-800">{details}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
            <span>Session: {rating.session_id.substring(0, 15)}...</span>
            <span>User: {rating.user_id}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "negative" | "positive">("all");

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await RatingService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError("Error al cargar las estadísticas");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = await RatingService.getAIAnalysis();
      setAiAnalysis(data);
      setShowAIPanel(true);
    } catch (err) {
      console.error("Error fetching AI analysis:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredRatings = stats?.recentRatings.filter((r) => {
    if (activeTab === "all") return true;
    return r.rating === activeTab;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchStats} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard de Calidad RAG</h1>
                <p className="text-sm text-gray-500">Análisis detallado de feedback del usuario</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
                {isAnalyzing ? "Analizando..." : "Analizar con IA"}
              </button>
              <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Analysis Panel */}
        {showAIPanel && aiAnalysis && (
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Análisis con Inteligencia Artificial</h3>
                  <p className="text-sm text-purple-100">Analizado: {new Date(aiAnalysis.analyzedAt).toLocaleString("es")}</p>
                </div>
              </div>
              <button onClick={() => setShowAIPanel(false)} className="p-1 hover:bg-white/20 rounded transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  Resumen Ejecutivo
                </h4>
                <p className="text-gray-700 bg-white rounded-lg p-4 border border-purple-100">{aiAnalysis.aiAnalysis.summary}</p>
              </div>

              {/* Main Issues */}
              {aiAnalysis.aiAnalysis.mainIssues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Problemas Principales Identificados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiAnalysis.aiAnalysis.mainIssues.map((issue, i) => (
                      <div key={i} className="bg-white rounded-lg p-4 border border-amber-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{issue.count}</span>
                          <span className="font-medium text-gray-800">{issue.category}</span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {aiAnalysis.aiAnalysis.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    Recomendaciones
                  </h4>
                  <div className="bg-white rounded-lg p-4 border border-green-100 space-y-2">
                    {aiAnalysis.aiAnalysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patterns */}
              {aiAnalysis.aiAnalysis.patterns.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Patrones Detectados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.aiAnalysis.patterns.map((pattern, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Assessment */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-1">Evaluación General</h4>
                <p className="text-purple-700">{aiAnalysis.aiAnalysis.overallAssessment}</p>
              </div>

              {/* Feedback Categories */}
              {aiAnalysis.feedbackCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Categorías de Feedback</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.feedbackCategories.map((cat, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {cat.category} <span className="font-bold">({cat.count})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Ratings */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Calificaciones</p>
            <p className="dashboard-stat">{stats?.totalRatings || 0}</p>
          </div>

          {/* Satisfaction Rate */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              {stats && stats.satisfactionRate >= 70 && <span className="dashboard-trend-positive">Excelente</span>}
              {stats && stats.satisfactionRate < 70 && stats.satisfactionRate >= 50 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Regular</span>
              )}
              {stats && stats.satisfactionRate < 50 && <span className="dashboard-trend-negative">Crítico</span>}
            </div>
            <p className="text-sm text-gray-500 mb-1">Tasa de Satisfacción</p>
            <p className="dashboard-stat">{stats?.satisfactionRate || 0}%</p>
          </div>

          {/* Positive Ratings */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Respuestas Útiles</p>
            <p className="text-3xl font-bold text-green-600">{stats?.positiveRatings || 0}</p>
          </div>

          {/* Negative Ratings */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ThumbsDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Respuestas No Útiles</p>
            <p className="text-3xl font-bold text-red-500">{stats?.negativeRatings || 0}</p>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Conversations with ratings */}
          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversaciones Evaluadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalConversations || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Promedio: <span className="font-medium text-gray-700">{stats?.avgRatingsPerConversation || 0} calificaciones por conversación</span>
            </p>
          </div>

          {/* Trend Chart */}
          <div className="dashboard-card">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Tendencia Últimos 7 Días</h3>
            {stats?.ratingsByDay && stats.ratingsByDay.length > 0 ? (
              <div className="flex items-end gap-2 h-24">
                {stats.ratingsByDay
                  .slice()
                  .reverse()
                  .map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-0.5">
                        <div
                          className="w-full bg-green-400 rounded-t"
                          style={{
                            height: `${Math.max((day.positive / Math.max(...stats.ratingsByDay.map((d) => d.positive + d.negative), 1)) * 60, 4)}px`,
                          }}
                        />
                        <div
                          className="w-full bg-red-400 rounded-b"
                          style={{
                            height: `${Math.max((day.negative / Math.max(...stats.ratingsByDay.map((d) => d.positive + d.negative), 1)) * 60, 4)}px`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(day.date).toLocaleDateString("es", { weekday: "short" })}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-gray-400">Sin datos de tendencia</div>
            )}
          </div>
        </div>

        {/* Detailed Ratings Section */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Detalle de Calificaciones</h3>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Todas ({stats?.totalRatings || 0})
              </button>
              <button
                onClick={() => setActiveTab("negative")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "negative" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Negativas ({stats?.negativeRatings || 0})
              </button>
              <button
                onClick={() => setActiveTab("positive")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "positive" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Positivas ({stats?.positiveRatings || 0})
              </button>
            </div>
          </div>

          {filteredRatings && filteredRatings.length > 0 ? (
            <div className="space-y-2">
              {filteredRatings.map((rating) => (
                <RatingDetailCard key={rating.id} rating={rating} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay calificaciones {activeTab !== "all" ? `${activeTab}s` : ""} aún</p>
            </div>
          )}
        </div>

        {/* Top Issues */}
        {stats?.topNegativeQuestions && stats.topNegativeQuestions.length > 0 && (
          <div className="dashboard-card mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Preguntas con Más Problemas
            </h3>
            <p className="text-sm text-gray-500 mb-4">Estas son las preguntas que más frecuentemente reciben respuestas negativas</p>
            <div className="space-y-3">
              {stats.topNegativeQuestions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-200 text-amber-700 rounded-full text-sm font-bold">{item.count}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{item.question}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      {item.count} {item.count === 1 ? "respuesta negativa" : "respuestas negativas"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
