"use client";

import { Message } from "@/types";
import { useScrollToBottom } from "@/app/hooks/useScrollToBottom";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import EmptyState from "./EmptyState";
import React from "react";

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  children?: React.ReactNode;
  extraDeps?: any[];
  sessionId?: string;
  userId?: string;
}

export default function MessagesList({ messages, isLoading, children, extraDeps = [], sessionId, userId }: MessagesListProps) {
  const { elementRef } = useScrollToBottom([messages, isLoading, ...extraDeps]);

  // Find the previous user message for each AI message
  const getPreviousUserQuestion = (index: number): string | undefined => {
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].isUser && typeof messages[i].content === "string") {
        return messages[i].content as string;
      }
    }
    return undefined;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar px-10">
      {/* Estado vacío solo si no hay mensajes y NO está cargando */}
      {messages.length === 0 && !isLoading && <EmptyState />}

      {/* Indicador de carga centrado si no hay mensajes y está cargando */}
      {messages.length === 0 && isLoading && (
        <div className="flex items-center justify-center h-full">
          <LoadingIndicator />
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} sessionId={sessionId} userId={userId} userQuestion={getPreviousUserQuestion(index)} />
      ))}

      {/* Sugerencias o cualquier contenido adicional */}
      {children}

      {/* Indicador de carga al final si hay mensajes y está cargando (para nuevas respuestas) */}
      {messages.length > 0 && isLoading && <LoadingIndicator />}

      <div ref={elementRef} />
    </div>
  );
}
