"use client";

import { ChatInterfaceProps } from "@/types";
import { useChat } from "@/app/hooks/useChat";
import MessagesList from "./ui/MessagesList";
import ChatInput from "./ui/ChatInput";

export default function ChatInterface({
  userData,
  isDataReceived,
  sendMessageToParent,
}: ChatInterfaceProps) {
  const { messages, sendMessage, isLoading } = useChat(userData);

  return (
    <div className="flex flex-col h-full w-full">
      <MessagesList messages={messages} isLoading={isLoading} />
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isDataReceived={isDataReceived}
      />
    </div>
  );
}
