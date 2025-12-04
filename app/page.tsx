"use client";

import { useState } from "react";
import { useDocumentationDrawerControls } from "@/hooks/useDocumentationDrawerControls";
import { useUserData } from "@/hooks/useUserData";
import { useConversationHistory } from "@/app/hooks/useConversationHistory";
import { openChatInNewTab } from "@/app/utils/standaloneSession";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ChatInterface from "./components/ChatInterface";
import WelcomeScreen from "./components/ui/WelcomeScreen";
import Sidebar from "./components/ui/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(300);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();

  const { closeDrawer } = useDocumentationDrawerControls({
    onToggleDrawer: () => {},
    setDrawerWidth,
  });

  const { userData, isDataReceived, sendMessageToParent } = useUserData();
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    selectedConversationId,
    handleNewChat,
    handleSelectConversation,
    refreshConversations,
  } = useConversationHistory(isDataReceived ? userData?.IdUser : undefined);

  const handleSidebarNewChat = () => {
    handleNewChat();
    setIsSidebarOpen(false);
  };

  const handleSidebarSelectConversation = (id: string, text: string) => {
    handleSelectConversation(id, text);
    setIsSidebarOpen(false);
  };

  const handleOpenInNewTab = () => {
    if (isDataReceived && currentSessionId) {
      openChatInNewTab(userData, currentSessionId, selectedConversationId || undefined);
    }
  };

  const handleSessionIdChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <WelcomeScreen onStart={() => setShowWelcome(false)} userData={userData} />
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative h-screen w-full bg-white flex flex-col"
        >
          {/* Navigation bar */}
          <nav className="bg-white/80 backdrop-blur-md flex items-center justify-between px-4 py-2 flex-shrink-0 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-gray-500 hover:bg-gray-300 focus:outline-none transition-all duration-200 hover:scale-105 rounded-lg">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <Sidebar
                    conversations={conversations}
                    onNewChat={handleSidebarNewChat}
                    onSelectConversation={handleSidebarSelectConversation}
                    loading={conversationsLoading}
                    error={conversationsError}
                  />
                </SheetContent>
              </Sheet>

              <Image src="/ia_face.png" alt="Logo Asistente Clave" width={50} height={50} className="object-cover object-top" />

              <span className="font-bold text-2xl bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] bg-clip-text text-transparent">Asistente Clave</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón abrir en nueva pestaña */}
              {isDataReceived && (
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 text-gray-500 hover:bg-gray-300 focus:outline-none transition-all duration-200 hover:scale-105 rounded-lg"
                  title="Abrir en nueva pestaña"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
              )}

              {/* Botón cerrar */}
              <button onClick={closeDrawer} className="p-2 text-gray-500 hover:bg-gray-300 focus:outline-none transition-all duration-200 hover:scale-105 rounded-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </nav>

          <div className="flex-1 overflow-hidden">
            <ChatInterface
              key={selectedConversationId || "new-chat"}
              userData={userData}
              isDataReceived={isDataReceived}
              sendMessageToParent={sendMessageToParent}
              conversationId={selectedConversationId}
              onConversationCreated={refreshConversations}
              onSessionIdChange={handleSessionIdChange}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
