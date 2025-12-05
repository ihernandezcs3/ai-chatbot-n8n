"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ConversationHistory, UserData } from "@/types";
import { ConversationService } from "@/app/services/conversationService";
import { getDataFromUrl } from "@/app/utils/standaloneSession";
import { TokenService } from "@/app/services/tokenService";

interface StandaloneContextType {
  userData: UserData | null;
  isDataReceived: boolean;
  conversations: ConversationHistory[];
  loading: boolean;
  error: string | null;
  refreshConversations: () => void;
}

const StandaloneContext = createContext<StandaloneContextType | null>(null);

export function StandaloneProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDataReceived, setIsDataReceived] = useState(false);
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Cargar datos de usuario desde URL o sessionStorage
  useEffect(() => {
    if (initialized) return;

    const urlData = getDataFromUrl();
    if (urlData) {
      console.log("StandaloneProvider: Datos cargados de URL:", urlData);

      // Decodificar token para obtener los datos del usuario
      const tokenPayload = TokenService.decodeToken(urlData.token);

      const newUserData: UserData = {
        CliCod: urlData.CliCod,
        PrdCod: urlData.PrdCod,
        token: urlData.token,
        IdUser: tokenPayload?.IdUser || urlData.IdUser,
        unique_name: tokenPayload?.unique_name,
        Document: tokenPayload?.Document,
        FirstName: tokenPayload?.FirstName,
        LastName: tokenPayload?.LastName,
        email: tokenPayload?.email,
        role: tokenPayload?.role,
        nbf: tokenPayload?.nbf,
        exp: tokenPayload?.exp,
        iat: tokenPayload?.iat,
      };

      setUserData(newUserData);
      setIsDataReceived(true);

      // Guardar en sessionStorage para persistir entre navegaciones
      sessionStorage.setItem("standalone_user_data", JSON.stringify(newUserData));

      // Limpiar param data de URL
      const url = new URL(window.location.href);
      url.searchParams.delete("data");
      window.history.replaceState({}, "", url.pathname + url.search);
    } else {
      // Intentar recuperar de sessionStorage
      const stored = sessionStorage.getItem("standalone_user_data");
      if (stored) {
        console.log("StandaloneProvider: Datos recuperados de sessionStorage");
        const parsedData = JSON.parse(stored);
        setUserData(parsedData);
        setIsDataReceived(true);
      }
    }
    setInitialized(true);
  }, [initialized]);

  // Cargar conversaciones cuando tengamos userId
  useEffect(() => {
    if (userData?.IdUser && conversations.length === 0) {
      loadConversations(userData.IdUser);
    }
  }, [userData?.IdUser]);

  const loadConversations = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ConversationService.getConversations(userId);
      setConversations(data);
      console.log(`StandaloneProvider: ${data.length} conversaciones cargadas`);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("No se pudieron cargar las conversaciones");
    } finally {
      setLoading(false);
    }
  };

  const refreshConversations = useCallback(() => {
    if (userData?.IdUser) {
      loadConversations(userData.IdUser);
    }
  }, [userData?.IdUser]);

  return (
    <StandaloneContext.Provider
      value={{
        userData,
        isDataReceived,
        conversations,
        loading,
        error,
        refreshConversations,
      }}
    >
      {children}
    </StandaloneContext.Provider>
  );
}

export function useStandaloneContext() {
  const context = useContext(StandaloneContext);
  if (!context) {
    throw new Error("useStandaloneContext must be used within StandaloneProvider");
  }
  return context;
}
