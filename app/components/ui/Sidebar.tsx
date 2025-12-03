"use client";

import { MessageSquare } from "lucide-react";
import { ConversationHistory } from "@/types";
import { Cs3Icon } from "@/icons";

interface SidebarProps {
  conversations: ConversationHistory[];
  onNewChat: () => void;
  onSelectConversation: (id: string, text: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function Sidebar({ conversations, onNewChat, onSelectConversation, loading = false, error = null }: SidebarProps) {
  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, item) => {
    const date = new Date(item.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, ConversationHistory[]>);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-2 px-2 overflow-y-auto custom-scrollbar">
        {/* Company logo */}
        <div className="flex justify-start mb-6">
          <Cs3Icon className="w-auto h-auto" />
        </div>

        {/* New conversation button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 mb-4 text-left text-white bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] hover:opacity-90 rounded-lg transition-all duration-200"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Nueva conversación</span>
        </button>

        {/* Conversation history */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 px-3">Historial</h3>

          {/* Loading state */}
          {loading && (
            <div className="px-3 py-4 text-center text-gray-500">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && <div className="px-3 py-4 text-center text-red-500 text-sm">{error}</div>}

          {/* Empty state */}
          {!loading && !error && conversations.length === 0 && <div className="px-3 py-4 text-center text-gray-500 text-sm">No hay conversaciones previas</div>}

          {/* Conversations list */}
          {!loading &&
            !error &&
            Object.entries(groupedConversations).map(([dateString, conversations]) => (
              <div key={dateString} className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 px-3 uppercase tracking-wide">{formatDate(dateString)}</h4>
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onSelectConversation(conversation.id, conversation.title)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 truncate">{conversation.title}</p>
                      {conversation.message_count && conversation.message_count > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {conversation.message_count} mensaje{conversation.message_count > 1 ? "s" : ""}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
