import { ConversationHistory } from "@/types";

export const useConversationHistory = () => {
  // Mock data for conversation history
  const conversations: ConversationHistory[] = [
    {
      id: "1",
      text: "Hola, necesito ayuda con las facturas del mes pasado",
      date: new Date(),
    },
    {
      id: "2",
      text: "¿Cuáles son los productos más vendidos este año?",
      date: new Date(),
    },
    {
      id: "3",
      text: "Tengo un problema con el sistema de pagos",
      date: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: "4",
      text: "Me gustaría conocer más sobre los planes disponibles",
      date: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: "5",
      text: "Necesito configurar mi perfil de usuario",
      date: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];

  const handleNewChat = () => {
    // Logic to start a new conversation
    console.log("Nueva conversación iniciada");
  };

  const handleSelectConversation = (conversationId: string, text: string) => {
    // Logic to load a specific conversation
    console.log(`Conversación seleccionada: ${text} (ID: ${conversationId})`);
  };

  return {
    conversations,
    handleNewChat,
    handleSelectConversation,
  };
};
