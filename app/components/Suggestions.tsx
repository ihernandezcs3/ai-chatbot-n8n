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

  // if (error) {
  //   // Ocultamos la sección hasta que vuelva a conectarse automáticamente
  //   return null;
  // }

  // if (!isConnected) {
  //   return null;
  // }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <div className="flex flex-col gap-[9px]">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-fit px-[10px] py-[6px] h-10 font-normal text-base rounded-lg border transition-colors ${
              suggestion.type === "question"
                ? "border-[#078BCD] text-[#078BCD] hover:bg-blue-50"
                : suggestion.type === "answer"
                ? "border-[#00BB89] text-[#00BB89] hover:bg-green-50"
                : suggestion.type === "confirmation"
                ? "border-[#00966E] text-[#00966E] hover:bg-emerald-50"
                : suggestion.type === "negation"
                ? "border-[#CC3F46] text-[#CC3F46] hover:bg-red-50"
                : suggestion.type === "suggestion"
                ? "border-[#323E93] text-[#323E93] hover:bg-purple-50"
                : suggestion.type === "action"
                ? "border-[#078BCD] text-[#078BCD] hover:bg-blue-50"
                : suggestion.type === "help"
                ? "border-[#2F3B8A] text-[#2F3B8A] hover:bg-indigo-50"
                : "border-gray-700 text-gray-700 hover:bg-gray-50"
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
