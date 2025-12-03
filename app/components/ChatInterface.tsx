"use client";

import { ChatInterfaceProps } from "@/types";
import { useChat } from "@/app/hooks/useChat";
import MessagesList from "./ui/MessagesList";
import ChatInput from "./ui/ChatInput";
import Suggestions from "./Suggestions";
import { useSuggestions } from "@/app/hooks/useSuggestions";

export default function ChatInterface({ userData, isDataReceived, sendMessageToParent, conversationId = null }: ChatInterfaceProps) {
  const { messages, sendMessage, isLoading, sessionId } = useChat(userData, conversationId);

  // Hook único para las sugerencias en esta sesión
  const { suggestions, isConnected: suggestionsConnected, error: suggestionsError, clearSuggestions } = useSuggestions(sessionId);

  const handleSuggestionSelect = (text: string) => {
    clearSuggestions();
    sendMessage(text);
  };

  const handleSendMessage = (content: string) => {
    clearSuggestions();
    sendMessage(content);
  };

  // Check if there are AI responses (messages from assistant)
  const hasAIResponses = messages.some((message) => !message.isUser);

  return (
    <div className="flex flex-col h-full w-full">
      <MessagesList messages={messages} isLoading={isLoading} extraDeps={[suggestions]}>
        {hasAIResponses && suggestions.length > 0 && (
          <Suggestions suggestions={suggestions} onSuggestionSelect={handleSuggestionSelect} isConnected={suggestionsConnected} error={suggestionsError} />
        )}
      </MessagesList>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} isDataReceived={isDataReceived} />
    </div>
  );
}
