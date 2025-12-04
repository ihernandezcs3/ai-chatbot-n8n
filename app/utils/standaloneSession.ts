import { UserData } from "@/types";

interface StandaloneData {
  CliCod: number;
  PrdCod: number;
  token: string;
  IdUser?: string;
  tokenPayload?: any;
  sessionId?: string;
}

/**
 * Codifica los datos del usuario para pasarlos por URL
 */
export const encodeUserDataForUrl = (userData: UserData, sessionId?: string): string => {
  try {
    const essentialData: StandaloneData = {
      CliCod: userData.CliCod,
      PrdCod: userData.PrdCod,
      token: userData.token,
      IdUser: userData.IdUser,
      tokenPayload: userData.tokenPayload,
      sessionId,
    };
    const jsonString = JSON.stringify(essentialData);
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64;
  } catch (e) {
    console.error("Error encoding user data:", e);
    return "";
  }
};

/**
 * Decodifica los datos del usuario desde la URL
 */
export const decodeUserDataFromUrl = (encoded: string): StandaloneData | null => {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const data = JSON.parse(jsonString);
    return data;
  } catch (e) {
    console.error("Error decoding user data:", e);
    return null;
  }
};

/**
 * Genera la URL para abrir el chat en nueva pestaña
 * Formato: /standalone/[conversationId]?data=... o /standalone?data=...
 */
export const getStandaloneUrl = (userData: UserData, sessionId?: string, conversationId?: string, baseUrl?: string): string => {
  const encodedData = encodeUserDataForUrl(userData, sessionId);
  const base = baseUrl || window.location.origin;

  if (conversationId) {
    // URL con conversación específica: /standalone/abc123?data=...
    return `${base}/standalone/${conversationId}?data=${encodedData}`;
  }
  // Nueva conversación: /standalone?data=...
  return `${base}/standalone?data=${encodedData}`;
};

/**
 * Abre el chat en una nueva pestaña (modo standalone)
 */
export const openChatInNewTab = (userData: UserData, sessionId?: string, conversationId?: string, baseUrl?: string): void => {
  const url = getStandaloneUrl(userData, sessionId, conversationId, baseUrl);
  window.open(url, "_blank");
};

/**
 * Extrae los datos del usuario desde los parámetros de URL
 */
export const getDataFromUrl = (): StandaloneData | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("data");

  if (!encodedData) return null;

  return decodeUserDataFromUrl(encodedData);
};
