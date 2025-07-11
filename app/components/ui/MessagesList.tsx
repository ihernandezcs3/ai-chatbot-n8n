"use client";

import { Message } from "@/types";
import { useScrollToBottom } from "@/app/hooks/useScrollToBottom";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";
import EmptyState from "./EmptyState";

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessagesList({
  messages,
  isLoading,
}: MessagesListProps) {
  const { elementRef } = useScrollToBottom([messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar px-10">
      {messages.length === 0 && <EmptyState />}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && <LoadingIndicator />}

      <div ref={elementRef} />
    </div>
  );
}
