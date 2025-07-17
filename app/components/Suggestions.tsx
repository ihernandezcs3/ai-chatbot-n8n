import React from "react";
import { Suggestion as SuggestionType } from "@/types/Suggestion";

interface SuggestionsProps {
  suggestions: SuggestionType[];
  isConnected: boolean;
  error: string | null;
  onSuggestionSelect: (text: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  isConnected,
  error,
  onSuggestionSelect,
}) => {
  const handleSuggestionClick = (suggestion: SuggestionType) => {
    onSuggestionSelect(suggestion.text);
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 text-sm">
          Error connecting to suggestions: {error}
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return null;
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-[9px]">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-fit px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              suggestion.type === "question"
                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                : suggestion.type === "answer"
                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                : suggestion.type === "confirmation"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : suggestion.type === "negation"
                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                : suggestion.type === "suggestion"
                ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                : suggestion.type === "action"
                ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                : suggestion.type === "help"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
