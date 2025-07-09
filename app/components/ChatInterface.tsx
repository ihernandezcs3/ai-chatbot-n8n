"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import DynamicComponentRenderer from "./DynamicComponentRenderer";
import MarkdownRenderer from "./MarkdownRenderer";
import { SacAgentResponse, ComponentData } from "../../types/AgentResponse";
import { trackChatEvent } from "./AnalyticsProvider";
import { useParentData } from "./ParentDataContext";

interface Message {
  id: string;
  content: string | ComponentData[]; // Can be string or component data
  isUser: boolean;
  timestamp: Date;
  hasComponents?: boolean;
  isMarkdown?: boolean;
  actions?: any[]; // Actions from the agent response
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(
    () => `session_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { parentData, isDataReceived, sendMessageToParent } = useParentData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track session start
  useEffect(() => {
    trackChatEvent("chat_session_started", {
      sessionId: sessionId,
    });
  }, [sessionId]);

  // Notificar al padre cuando se inicia la sesión
  useEffect(() => {
    if (isDataReceived && parentData) {
      sendMessageToParent({
        type: "SESSION_STARTED",
        data: {
          sessionId,
          parentData,
        },
      });
    }
  }, [isDataReceived, parentData, sessionId, sendMessageToParent]);

  // Function to detect if content contains Markdown
  const containsMarkdown = (content: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s/, // Headers
      /\*\*.*\*\*/, // Bold
      /\*.*\*/, // Italic
      /\[.*\]\(.*\)/, // Links
      /```[\s\S]*```/, // Code blocks
      /`.*`/, // Inline code
      /^\s*[-*+]\s/, // Unordered lists
      /^\s*\d+\.\s/, // Ordered lists
      /^\s*>\s/, // Blockquotes
      /\|.*\|.*\|/, // Tables
      /~~.*~~/, // Strikethrough
      /^\s*- \[ \]/, // Task lists
    ];

    return markdownPatterns.some((pattern) => pattern.test(content));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Track message sent event
    trackChatEvent("chat_message_sent", {
      messageLength: content.trim().length,
      sessionId: sessionId,
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Metadata que se enviará con cada mensaje
      const metadata = {
        CliCod: parentData?.CliCod || 20115,
        PrdCod: parentData?.PrdCod || 4,
        Email: parentData?.Email || "ihernandez@comercializadora-s3.com",
        userName: parentData?.userName || "Usuario",
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          chatInput: content.trim(),
          metadata: metadata, // Agregamos la metadata al payload
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SacAgentResponse = await response.json();
      console.log("Webhook Response:", data);

      // Check if the response contains component data (legacy support)
      const hasComponents = data.components && Array.isArray(data.components);

      // Use the output field from SacAgentResponse
      const messageContent = hasComponents ? data.components : data.output;

      // Check if the content contains Markdown
      const isMarkdown =
        typeof messageContent === "string" && containsMarkdown(messageContent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: messageContent || "No se recibió respuesta",
        isUser: false,
        timestamp: new Date(),
        hasComponents,
        isMarkdown,
        actions: data.actions, // Store actions for potential future use
      };

      setMessages((prev) => [...prev, botMessage]);

      // Track successful response
      trackChatEvent("chat_response_received", {
        hasComponents: hasComponents,
        isMarkdown: isMarkdown,
        responseLength:
          typeof messageContent === "string"
            ? messageContent.length
            : "component",
        sessionId: sessionId,
      });

      // Notificar al padre sobre la respuesta recibida
      sendMessageToParent({
        type: "RESPONSE_RECEIVED",
        data: {
          sessionId,
          hasComponents,
          isMarkdown,
          responseLength:
            typeof messageContent === "string"
              ? messageContent.length
              : "component",
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Track error event
      trackChatEvent("chat_error", {
        error: error instanceof Error ? error.message : "Unknown error",
        sessionId: sessionId,
      });

      // Notificar al padre sobre el error
      sendMessageToParent({
        type: "ERROR",
        data: {
          sessionId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, encontré un error. Por favor intenta de nuevo.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageContent = (message: Message) => {
    if (message.hasComponents && Array.isArray(message.content)) {
      return (
        <div className="space-y-3">
          {message.content.map((component: ComponentData, index: number) => (
            <DynamicComponentRenderer key={index} data={component} />
          ))}
        </div>
      );
    }

    if (message.isMarkdown && typeof message.content === "string") {
      return <MarkdownRenderer content={message.content} />;
    }

    return (
      <p className="text-sm whitespace-pre-wrap">{message.content as string}</p>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
            <img
              src="/logo_cs3.png"
              alt="Logo CS3"
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Asistente de Chat IA
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Sesión: {sessionId}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
        {!isDataReceived && (
          <div className="text-center text-gray-500 mt-20">
            <img
              src="/logo_cs3.png"
              alt="Logo CS3"
              className="w-12 h-12 mx-auto mb-4 opacity-70"
            />
            <p className="text-lg">Esperando datos...</p>
            <p className="text-sm mt-2">
              El chat se activará cuando se reciban los datos necesarios
            </p>
          </div>
        )}

        {isDataReceived && messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <img
              src="/logo_cs3.png"
              alt="Logo CS3"
              className="w-12 h-12 mx-auto mb-4 opacity-70"
            />
            <p className="text-lg">
              Inicia una conversación con el asistente IA
            </p>
            <p className="text-sm mt-2">¡Pregúntame lo que quieras!</p>
            {parentData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  Conectado como: {parentData.userName || parentData.Email}
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.isUser
                  ? "bg-blue-600 text-white max-w-[85%] sm:max-w-md"
                  : "bg-white border border-gray-200 text-gray-900 max-w-[95%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
              } px-3 sm:px-4 py-3 rounded-lg`}
            >
              <div className="flex items-start gap-2">
                {!message.isUser && (
                  <img
                    src="/logo_cs3.png"
                    alt="Logo CS3"
                    className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 opacity-60 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {renderMessageContent(message)}
                  <p
                    className={`text-xs mt-2 ${
                      message.isUser ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.isUser && (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-blue-100 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 max-w-[95%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-3 sm:px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  src="/logo_cs3.png"
                  alt="Logo CS3"
                  className="w-4 h-4 sm:w-5 sm:h-5 opacity-60"
                />
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: "#F0627D" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#4DC37E",
                      animationDelay: "0.1s",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#3B82F6",
                      animationDelay: "0.2s",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "#F6B042",
                      animationDelay: "0.3s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className=" px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <textarea
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isDataReceived
                  ? "Escribe tu mensaje... (Shift + Enter para nueva línea)"
                  : "Esperando datos..."
              }
              disabled={isLoading || !isDataReceived}
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500 text-sm sm:text-base leading-relaxed min-h-[20px] max-h-32 overflow-y-auto disabled:cursor-not-allowed"
              style={{
                minHeight: "20px",
                maxHeight: "128px",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim() || !isDataReceived}
              className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-xs text-gray-400">
              Presiona Enter para enviar, Shift + Enter para nueva línea
            </p>
            {isLoading && (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
