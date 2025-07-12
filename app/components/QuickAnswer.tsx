"use client";

import React from "react";
import { useQuickAnswer } from "@/hooks/useQuickAnswer";
import { QuickAnswer as QuickAnswerType } from "@/types/QuickAnswer";

interface QuickAnswerProps {
  onQuickAnswerSelect: (text: string) => void;
  className?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  onQuickAnswerSelect,
  className = "",
}) => {
  const { quickAnswers, isConnected, error } = useQuickAnswer();

  const handleQuickAnswerClick = (quickAnswer: QuickAnswerType) => {
    onQuickAnswerSelect(quickAnswer.text);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "answer":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "confirmation":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
      case "negation":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      case "suggestion":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
      case "action":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
      case "help":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "question":
        return "❓";
      case "answer":
        return "💡";
      case "confirmation":
        return "✅";
      case "negation":
        return "❌";
      case "suggestion":
        return "💭";
      case "action":
        return "⚡";
      case "help":
        return "🆘";
      default:
        return "💬";
    }
  };

  if (quickAnswers.length === 0) {
    return null;
  }

  return (
    <div className={`quick-answer-container ${className}`}>
      {/* Connection Status */}
      {error && (
        <div className="mb-2 text-xs text-red-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Error de conexión
        </div>
      )}

      {!error && (
        <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
          {isConnected ? "Conectado" : "Conectando..."}
        </div>
      )}

      {/* Quick Answers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        {quickAnswers.map((quickAnswer) => (
          <button
            key={quickAnswer.id}
            onClick={() => handleQuickAnswerClick(quickAnswer)}
            className={`
              px-3 py-2 text-sm rounded-lg border transition-all duration-200
              ${getTypeColor(quickAnswer.type)}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transform hover:scale-105 active:scale-95
            `}
            title={`Tipo: ${quickAnswer.type}${
              quickAnswer.category
                ? ` | Categoría: ${quickAnswer.category}`
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(quickAnswer.type)}</span>
              <span className="truncate">{quickAnswer.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAnswer;
