import { useState, useEffect, useRef } from "react";
import { UserData } from "@/types";
import { TokenService } from "@/app/services/tokenService";
import { getDataFromUrl } from "@/app/utils/standaloneSession";

const STORAGE_KEY = "ai_chatbot_user_data";

interface UseUserDataProps {
  onDataReceived?: (data: UserData) => void;
}

const getStoredUserData = (): { userData: UserData; isReceived: boolean } | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading from sessionStorage:", e);
  }
  return null;
};

const saveUserData = (userData: UserData, isReceived: boolean) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ userData, isReceived }));
  } catch (e) {
    console.error("Error saving to sessionStorage:", e);
  }
};

const defaultUserData: UserData = {
  CliCod: 99999999999,
  PrdCod: 4444444444444,
  Email: "email ejemplo",
  userName: "Usuario ejemplo",
  token: "token",
  iframeWidth: 600,
};

export const useUserData = ({ onDataReceived }: UseUserDataProps = {}) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isDataReceived, setIsDataReceived] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [standaloneSessionId, setStandaloneSessionId] = useState<string | undefined>();

  const hasValidData = useRef(false);

  const sendMessageToParent = (message: any) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, document.location.origin);
    }
  };

  // Recuperar datos al montar
  useEffect(() => {
    // Verificar si hay datos en URL (modo standalone)
    const urlData = getDataFromUrl();
    if (urlData) {
      console.log("Cargando datos de URL (standalone):", urlData);
      setUserData((prev) => ({
        ...prev,
        CliCod: urlData.CliCod,
        PrdCod: urlData.PrdCod,
        token: urlData.token,
        IdUser: urlData.IdUser,
        tokenPayload: urlData.tokenPayload,
      }));
      setIsDataReceived(true);
      hasValidData.current = true;
      setStandaloneSessionId(urlData.sessionId);

      // Limpiar solo el param data de la URL, mantener el path
      const url = new URL(window.location.href);
      url.searchParams.delete("data");
      window.history.replaceState({}, "", url.pathname);
    } else {
      // Modo iframe: recuperar de sessionStorage
      const storedData = getStoredUserData();
      if (storedData?.isReceived) {
        setUserData(storedData.userData);
        setIsDataReceived(true);
        hasValidData.current = true;
      }
    }
    setIsHydrated(true);
  }, []);

  // Guardar en sessionStorage
  useEffect(() => {
    if (isHydrated && isDataReceived) {
      saveUserData(userData, isDataReceived);
    }
  }, [userData, isDataReceived, isHydrated]);

  // Escuchar mensajes del padre (iframe)
  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      if (hasValidData.current && event.data.type !== "token") {
        console.log("Ignorando mensaje (ya hay datos válidos):", event.data.type);
        return;
      }

      switch (event.data.type) {
        case "cliCod":
          setUserData((prev) => ({ ...prev, CliCod: Number(event.data.cliCod) }));
          setIsDataReceived(true);
          hasValidData.current = true;
          break;
        case "prdCod":
          setUserData((prev) => ({ ...prev, PrdCod: Number(event.data.prdCod) }));
          setIsDataReceived(true);
          hasValidData.current = true;
          break;
        case "token":
          const token = event.data.token;
          const tokenPayload = TokenService.decodeToken(token);
          if (tokenPayload) {
            const currentIdUser = userData.IdUser;
            const newIdUser = tokenPayload.IdUser;
            if (currentIdUser && currentIdUser !== newIdUser) {
              hasValidData.current = false;
              sessionStorage.removeItem(STORAGE_KEY);
            }
            setUserData((prev) => ({
              ...prev,
              token,
              tokenPayload,
              IdUser: tokenPayload.IdUser,
            }));
          } else {
            setUserData((prev) => ({ ...prev, token }));
          }
          break;
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, [userData.IdUser]);

  useEffect(() => {
    if (isDataReceived && onDataReceived) {
      onDataReceived(userData);
    }
  }, [isDataReceived, userData, onDataReceived]);

  return {
    userData,
    isDataReceived,
    standaloneSessionId,
    sendMessageToParent,
  };
};
