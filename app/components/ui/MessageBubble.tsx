"use client";

import { Message, ComponentData } from "@/types";
import DynamicComponentRenderer from "../DynamicComponentRenderer";
import MarkdownRenderer from "../MarkdownRenderer";
import RatingButtons from "./RatingButtons";

interface MessageBubbleProps {
  message: Message;
  sessionId?: string;
  userId?: string;
  userQuestion?: string;
}

export default function MessageBubble({ message, sessionId, userId, userQuestion }: MessageBubbleProps) {
  const renderContent = () => {
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

    return <p className="text-sm whitespace-pre-wrap text-gray-700 font-medium">{message.content as string}</p>;
  };

  // Get message content as string for rating
  const getMessageContentString = (): string | undefined => {
    if (typeof message.content === "string") {
      return message.content;
    }
    return undefined;
  };

  // Show rating buttons for AI messages - use fallback userId if not provided
  const showRatingButtons = !message.isUser && sessionId;
  const effectiveUserId = userId || "anonymous";

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group ${
          message.isUser ? "bg-gray-100 text-gray-900 max-w-[85%] sm:max-w-md rounded-2xl" : "text-gray-900 max-w-[95%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
        } px-3 sm:px-4 py-3 ${!message.isUser ? "animate-silver-shimmer animate-message-fade-in rounded-lg" : ""}`}
      >
        <div className="flex items-start">
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
        {showRatingButtons && (
          <RatingButtons messageId={message.id} sessionId={sessionId} userId={effectiveUserId} messageContent={getMessageContentString()} userQuestion={userQuestion} />
        )}
      </div>
    </div>
  );
}
