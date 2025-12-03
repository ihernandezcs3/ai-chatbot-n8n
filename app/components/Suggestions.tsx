import React from "react";
import { Suggestion as SuggestionType } from "@/types/Suggestion";

interface SuggestionsProps {
  suggestions: SuggestionType[];
  isConnected: boolean;
  error: string | null;
  onSuggestionSelect: (text: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, isConnected, error, onSuggestionSelect }) => {
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

  // Función para obtener el icono según el tipo
  const getIcon = (type: string) => {
    switch (type) {
      case "question":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "action":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "suggestion":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "help":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Función para obtener los estilos según el tipo
  const getButtonStyles = (type: string) => {
    const baseStyles =
      "group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md";

    switch (type) {
      case "question":
        return `${baseStyles} bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300`;
      case "action":
        return `${baseStyles} bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300`;
      case "suggestion":
        return `${baseStyles} bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300`;
      case "help":
        return `${baseStyles} bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300`;
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} className={getButtonStyles(suggestion.type)}>
            <span className="transition-transform group-hover:scale-110">{getIcon(suggestion.type)}</span>
            <span className="leading-tight">{suggestion.text}</span>
            <span className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-current opacity-20 transition-opacity"></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
