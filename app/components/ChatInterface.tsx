"use client";

import { ChatInterfaceProps } from "@/types";
import { useChat } from "@/app/hooks/useChat";
import MessagesList from "./ui/MessagesList";
import ChatInput from "./ui/ChatInput";
import QuickAnswer from "./QuickAnswer";

export default function ChatInterface({
  userData,
  isDataReceived,
  sendMessageToParent,
}: ChatInterfaceProps) {
  const { messages, sendMessage, isLoading } = useChat(userData);

  const handleQuickAnswerSelect = (text: string) => {
    sendMessage(text);
  };

  // Check if there are AI responses (messages from assistant)
  const hasAIResponses = messages.some((message) => !message.isUser);

  return (
    <div className="flex flex-col h-full w-full">
      <MessagesList messages={messages} isLoading={isLoading} />
      {hasAIResponses && (
        <QuickAnswer
          onQuickAnswerSelect={handleQuickAnswerSelect}
          className="px-4"
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
