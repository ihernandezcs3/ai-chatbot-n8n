"use client";

import { MicIcon } from "@/icons";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDataReceived: boolean;
}

export default function ChatInput({ onSendMessage, isLoading, isDataReceived }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hook de reconocimiento de voz
  const { isListening, transcript, interimTranscript, error: speechError, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition("es-ES");

  // Actualizar input cuando hay transcripción
  useEffect(() => {
    if (transcript) {
      setInputValue((prev) => {
        const newValue = prev ? `${prev} ${transcript}` : transcript;
        return newValue;
      });
      resetTranscript();

      // Ajustar altura del textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + "px";
      }
    }
  }, [transcript, resetTranscript]);

  // Auto-focus logic: focus on mount and after the assistant finishes responding
  useEffect(() => {
    // Focus only when the input is enabled
    if (!isLoading && isDataReceived && !isListening) {
      textareaRef.current?.focus();
    }
  }, [isLoading, isDataReceived, isListening]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        // Detener grabación si está activa
        if (isListening) {
          stopListening();
        }
        onSendMessage(inputValue.trim());
        setInputValue("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [inputValue, onSendMessage, isListening, stopListening]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  }, []);

  const handleVoiceClick = useCallback(() => {
    if (!isSupported) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, isSupported, startListening, stopListening]);

  // Combinar texto actual con transcripción en tiempo real
  const displayValue = interimTranscript ? `${inputValue} ${interimTranscript}`.trim() : inputValue;

  return (
    <div className="flex-shrink-0 px-10 py-4 bg-white">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative bg-white border rounded-2xl p-4 transition-all duration-300 ${
            isListening
              ? "border-purple-400 ring-2 ring-purple-300 shadow-lg shadow-purple-100"
              : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Escuchando..." : isDataReceived ? "Introduce una petición para el Asistente Clave" : "Esperando datos..."}
            disabled={isLoading || !isDataReceived}
            rows={1}
            className={`w-full bg-transparent border-none outline-none resize-none placeholder-gray-400 text-sm sm:text-base leading-relaxed min-h-[20px] max-h-32 overflow-y-auto disabled:cursor-not-allowed custom-scrollbar-textarea pb-8 ${
              isListening ? "text-purple-700" : "text-gray-700"
            }`}
            style={{
              minHeight: "20px",
              maxHeight: "128px",
            }}
          />

          {/* Error de voz */}
          {speechError && <div className="absolute -top-8 left-4 text-xs text-red-500 bg-red-50 px-2 py-1 rounded">{speechError}</div>}

          {/* Action buttons */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => {
                // Add file/content functionality
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

            {/* Voice button with animation */}
            <div className="relative">
              {/* Ripple effect when listening */}
              {isListening && (
                <>
                  <span className="voice-ripple" />
                  <span className="voice-ripple" style={{ animationDelay: "0.5s" }} />
                </>
              )}

              <button
                type="button"
                disabled={!isSupported}
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  isListening
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-voice-pulse"
                    : isSupported
                    ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                onClick={handleVoiceClick}
                title={!isSupported ? "Reconocimiento de voz no soportado" : isListening ? "Detener grabación" : "Iniciar grabación de voz"}
              >
                {isListening ? (
                  // Animated wave bars when listening
                  <div className="flex items-center justify-center gap-[2px] w-5 h-5">
                    <span className="voice-wave-bar" />
                    <span className="voice-wave-bar" />
                    <span className="voice-wave-bar" />
                    <span className="voice-wave-bar" />
                    <span className="voice-wave-bar" />
                  </div>
                ) : (
                  <MicIcon className={`w-5 h-5 ${isSupported ? "animate-voice-glow" : ""}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
