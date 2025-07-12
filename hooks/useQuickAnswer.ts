import { useState, useEffect, useRef, useCallback } from "react";
import { QuickAnswerPayload, QuickAnswer } from "@/types/QuickAnswer";

export const useQuickAnswer = () => {
  const [quickAnswers, setQuickAnswers] = useState<QuickAnswer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      // Clean up existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const eventSource = new EventSource("/api/quickanswer");
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
          console.log("QuickAnswer SSE connected");
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle initial connection message
            if (data.type === "connected") {
              console.log("QuickAnswer SSE: Connected at", data.timestamp);
              return;
            }

            // Handle quick answers data
            if (data.quickAnswers && Array.isArray(data.quickAnswers)) {
              setQuickAnswers(data.quickAnswers);
              console.log(
                "QuickAnswer SSE: Received",
                data.quickAnswers.length,
                "quick answers"
              );
            }
          } catch (parseError) {
            console.error("Error parsing SSE data:", parseError);
          }
        };

        eventSource.onerror = (error) => {
          console.error("QuickAnswer SSE error:", error);
          setIsConnected(false);
          setError("Connection error");

          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isConnected) {
              connect();
            }
          }, 5000);
        };
      } catch (error) {
        console.error("Failed to create EventSource:", error);
        setError("Failed to connect");
      }
    };

    // Initial connection
    connect();

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsConnected(false);
    };
  }, []); // Empty dependency array - only run once

  const getQuickAnswersByType = useCallback(
    (type: string) => {
      return quickAnswers.filter((qa) => qa.type === type);
    },
    [quickAnswers]
  );

  const getQuickAnswersByCategory = useCallback(
    (category: string) => {
      return quickAnswers.filter((qa) => qa.category === category);
    },
    [quickAnswers]
  );

  const reconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    // The useEffect will handle reconnection
  }, []);

  return {
    quickAnswers,
    isConnected,
    error,
    getQuickAnswersByType,
    getQuickAnswersByCategory,
    reconnect,
  };
};
