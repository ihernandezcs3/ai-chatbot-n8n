import { useState, useEffect, useCallback } from "react";
import { SuggestionPayload, Suggestion } from "@/types/Suggestion";

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/suggestions");

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log("Suggestions SSE connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "connected") {
          console.log("Suggestions SSE: Connected at", data.timestamp);
          return;
        }

        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          console.log(
            "Suggestions SSE: Received",
            data.suggestions.length,
            "suggestions"
          );
        }
      } catch (error) {
        console.error("Error parsing suggestions SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Suggestions SSE error:", error);
      setError("Connection error");
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const sendSuggestion = useCallback(
    async (suggestionPayload: SuggestionPayload) => {
      try {
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(suggestionPayload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error sending suggestions:", error);
        throw error;
      }
    },
    []
  );

  const getSuggestionsByType = useCallback(
    (type: string) => {
      return suggestions.filter((suggestion) => suggestion.type === type);
    },
    [suggestions]
  );

  const getSuggestionsByCategory = useCallback(
    (category: string) => {
      return suggestions.filter(
        (suggestion) => suggestion.category === category
      );
    },
    [suggestions]
  );

  return {
    suggestions,
    isConnected,
    error,
    sendSuggestion,
    getSuggestionsByType,
    getSuggestionsByCategory,
  };
};
