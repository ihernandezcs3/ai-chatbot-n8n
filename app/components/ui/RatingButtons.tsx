"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ThumbsUp, ThumbsDown, X, Send } from "lucide-react";
import { RatingService } from "@/app/services/ratingService";

interface RatingButtonsProps {
  messageId: string;
  sessionId: string;
  userId: string;
  messageContent?: string;
  userQuestion?: string;
}

const FEEDBACK_OPTIONS = [
  { id: "incorrect", label: "Información incorrecta", emoji: "❌" },
  { id: "incomplete", label: "Respuesta incompleta", emoji: "📝" },
  { id: "irrelevant", label: "No responde la pregunta", emoji: "🎯" },
  { id: "confusing", label: "Respuesta confusa", emoji: "😕" },
  { id: "outdated", label: "Información desactualizada", emoji: "📅" },
  { id: "other", label: "Otro motivo", emoji: "💬" },
];

export default function RatingButtons({ messageId, sessionId, userId, messageContent, userQuestion }: RatingButtonsProps) {
  const [currentRating, setCurrentRating] = useState<"positive" | "negative" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePositiveRating = async () => {
    if (isSubmitting || currentRating === "positive") return;

    setIsSubmitting(true);
    try {
      await RatingService.submitRating({
        sessionId,
        messageId,
        userId,
        rating: "positive",
        messageContent,
        userQuestion,
      });
      setCurrentRating("positive");
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNegativeClick = () => {
    if (currentRating === "negative") return;
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const reasonLabel = FEEDBACK_OPTIONS.find((o) => o.id === selectedReason)?.label || "";
      const fullFeedback = feedbackText ? `[${reasonLabel}] ${feedbackText}` : reasonLabel;

      await RatingService.submitRating({
        sessionId,
        messageId,
        userId,
        rating: "negative",
        feedbackText: fullFeedback,
        messageContent,
        userQuestion,
      });
      setCurrentRating("negative");
      setShowFeedbackModal(false);
      setSelectedReason(null);
      setFeedbackText("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowFeedbackModal(false);
    setSelectedReason(null);
    setFeedbackText("");
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">¿Qué estuvo mal?</h3>
          <button onClick={handleCloseModal} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Reason Options */}
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedReason(option.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                  selectedReason === option.id ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detalles adicionales (opcional)</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Cuéntanos más sobre el problema..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Preview of what's being rated */}
          {userQuestion && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Tu pregunta:</p>
              <p className="text-sm text-gray-700 line-clamp-2">{userQuestion}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button onClick={handleCloseModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmitFeedback}
            disabled={!selectedReason || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={14} />
            Enviar feedback
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-1 mt-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handlePositiveRating}
          disabled={isSubmitting || currentRating !== null}
          className={`rating-button ${
            currentRating === "positive" ? "rating-button-active-positive" : currentRating === "negative" ? "opacity-30 cursor-default" : "rating-button-inactive"
          }`}
          title="Respuesta útil"
          aria-label="Marcar como útil"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          onClick={handleNegativeClick}
          disabled={isSubmitting || currentRating !== null}
          className={`rating-button ${
            currentRating === "negative" ? "rating-button-active-negative" : currentRating === "positive" ? "opacity-30 cursor-default" : "rating-button-inactive"
          }`}
          title="Respuesta no útil"
          aria-label="Marcar como no útil"
        >
          <ThumbsDown size={14} />
        </button>
        {currentRating && <span className="text-xs text-gray-400 ml-1">{currentRating === "positive" ? "¡Gracias!" : "Gracias por tu feedback"}</span>}
      </div>

      {/* Feedback Modal - rendered via portal to escape message container */}
      {mounted && showFeedbackModal && createPortal(modalContent, document.body)}
    </>
  );
}
