"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ParentAppData,
  ParentMessage,
  ChildMessage,
} from "../../types/AgentResponse";

interface ParentDataContextType {
  parentData: ParentAppData | null;
  isDataReceived: boolean;
  sendMessageToParent: (message: ChildMessage) => void;
}

const ParentDataContext = createContext<ParentDataContextType | undefined>(
  undefined
);

export const useParentData = () => {
  const context = useContext(ParentDataContext);
  if (context === undefined) {
    throw new Error("useParentData must be used within a ParentDataProvider");
  }
  return context;
};

interface ParentDataProviderProps {
  children: ReactNode;
}

export const ParentDataProvider: React.FC<ParentDataProviderProps> = ({
  children,
}) => {
  const [parentData, setParentData] = useState<ParentAppData | null>(null);
  const [isDataReceived, setIsDataReceived] = useState(false);

  // Función para enviar mensajes al padre
  const sendMessageToParent = (message: ChildMessage) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*");
    }
  };

  useEffect(() => {
    // Función para manejar mensajes del padre
    const handleParentMessage = (event: MessageEvent) => {
      // Verificar que el mensaje viene del padre
      if (event.source !== window.parent) {
        return;
      }

      try {
        const message: ParentMessage = event.data;

        switch (message.type) {
          case "INIT_DATA":
            if (message.data) {
              setParentData(message.data);
              setIsDataReceived(true);
              console.log("Datos recibidos del padre:", message.data);

              // Notificar al padre que los datos fueron recibidos
              sendMessageToParent({
                type: "SESSION_STARTED",
                data: { received: true },
              });
            }
            break;

          case "UPDATE_DATA":
            if (message.data) {
              setParentData(message.data);
              console.log("Datos actualizados del padre:", message.data);
            }
            break;

          case "RESET_SESSION":
            setParentData(null);
            setIsDataReceived(false);
            console.log("Sesión reseteada por el padre");
            break;

          default:
            console.warn("Tipo de mensaje no reconocido:", message.type);
        }
      } catch (error) {
        console.error("Error procesando mensaje del padre:", error);
      }
    };

    // Agregar listener para mensajes del padre
    window.addEventListener("message", handleParentMessage);

    // Notificar al padre que el iframe está listo
    sendMessageToParent({
      type: "SESSION_STARTED",
      data: { ready: true },
    });

    // Cleanup
    return () => {
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  const value: ParentDataContextType = {
    parentData,
    isDataReceived,
    sendMessageToParent,
  };

  return (
    <ParentDataContext.Provider value={value}>
      {children}
    </ParentDataContext.Provider>
  );
};
