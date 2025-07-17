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
}

export default function MessagesList({
  messages,
  isLoading,
  children,
  extraDeps = [],
}: MessagesListProps) {
  const { elementRef } = useScrollToBottom([messages, isLoading, ...extraDeps]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar px-10">
      {messages.length === 0 && <EmptyState />}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Sugerencias o cualquier contenido adicional */}
      {children}

      {isLoading && <LoadingIndicator />}

      <div ref={elementRef} />
    </div>
  );
}
