"use client";

import { ChatInterfaceProps } from "@/types";
import { useChat } from "@/app/hooks/useChat";
import MessagesList from "./ui/MessagesList";
import ChatInput from "./ui/ChatInput";
import Suggestions from "./Suggestions";

export default function ChatInterface({
  userData,
  isDataReceived,
  sendMessageToParent,
}: ChatInterfaceProps) {
  const { messages, sendMessage, isLoading, sessionId } = useChat(userData);

  const handleSuggestionSelect = (text: string) => {
    sendMessage(text);
  };

  // Check if there are AI responses (messages from assistant)
  const hasAIResponses = messages.some((message) => !message.isUser);

  return (
    <div className="flex flex-col h-full w-full">
      <MessagesList messages={messages} isLoading={isLoading} />
      {hasAIResponses && (
        <Suggestions
          onSuggestionSelect={handleSuggestionSelect}
          sessionId={sessionId}
        />
      )}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isDataReceived={isDataReceived}
      />
    </div>
  );
}
