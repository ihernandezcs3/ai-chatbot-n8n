"use client";

import { MicIcon } from "@/icons";
import { useState, useRef, useCallback, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDataReceived: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  isDataReceived,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus logic: focus on mount and after the assistant finishes responding
  useEffect(() => {
    // Focus only when the input is enabled
    if (!isLoading && isDataReceived) {
      textareaRef.current?.focus();
    }
  }, [isLoading, isDataReceived]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue.trim());
        setInputValue("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    },
    [inputValue, onSendMessage]
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

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    },
    []
  );

  return (
    <div className="flex-shrink-0 px-10 py-4 bg-white">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white border border-gray-300 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isDataReceived
                ? "Introduce una petición para el Asistente Clave"
                : "Esperando datos..."
            }
            disabled={isLoading || !isDataReceived}
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400 text-sm sm:text-base leading-relaxed min-h-[20px] max-h-32 overflow-y-auto disabled:cursor-not-allowed custom-scrollbar-textarea pb-8"
            style={{
              minHeight: "20px",
              maxHeight: "128px",
            }}
          />

          {/* Action buttons */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => {
                // Add file/content functionality
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => {
                // Add voice functionality
              }}
            >
              {/* <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg> */}
              <MicIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
