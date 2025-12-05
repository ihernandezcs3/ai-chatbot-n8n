"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ChatInterface from "../../components/ChatInterface";
import { TokenService } from "@/app/services/tokenService";
import { useStandaloneContext } from "../StandaloneContext";

export default function StandaloneConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  const { userData, isDataReceived, conversations, loading, error, refreshConversations } = useStandaloneContext();

  const handleNewConversation = () => {
    router.push("/standalone");
  };

  const handleConversationSelect = (id: string) => {
    router.push(`/standalone/${id}`);
  };

  const displayName = userData?.FirstName ? `${userData.FirstName} ${userData.LastName || ""}`.trim() : "Usuario";

  const currentTitle = conversations.find((c) => c.id === conversationId)?.title || "Conversación";

  // Mostrar loading mientras no tengamos datos
  if (!isDataReceived) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-500">Cargando datos de usuario...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fijo */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/ia_face.png" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="font-bold text-lg bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] bg-clip-text text-transparent">Asistente Clave</span>
          </div>
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva conversación
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Conversaciones</div>
          {loading ? (
            <div className="px-3 py-2 text-gray-400 text-sm">Cargando...</div>
          ) : error ? (
            <div className="px-3 py-2 text-red-400 text-sm">{error}</div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-2 text-gray-400 text-sm">Sin conversaciones</div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationSelect(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors truncate ${
                    conversationId === conv.id ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={conv.title}
                >
                  {conv.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9379E3] to-[#3A4CB1] flex items-center justify-center text-white font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
              <div className="text-xs text-gray-500 truncate">{userData?.email || ""}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Área principal del chat */}
      <main className="flex-1 flex flex-col bg-white">
        <header className="px-6 py-3 border-b border-gray-200">
          <h1 className="font-semibold text-gray-800">{currentTitle}</h1>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatInterface
            key={conversationId}
            userData={userData!}
            isDataReceived={isDataReceived}
            sendMessageToParent={() => {}}
            conversationId={conversationId}
            onConversationCreated={refreshConversations}
          />
        </div>
      </main>
    </div>
  );
}
