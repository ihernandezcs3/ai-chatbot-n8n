import { useState, useEffect } from "react";
import { UserData } from "@/types";
import { TokenService } from "@/app/services/tokenService";

interface UseUserDataProps {
  onDataReceived?: (data: UserData) => void;
}

export const useUserData = ({ onDataReceived }: UseUserDataProps = {}) => {
  const [userData, setUserData] = useState<UserData>({
    CliCod: 99999999999,
    PrdCod: 4444444444444,
    Email: "email ejemplo",
    userName: "Usuario ejemplo",
    token: "token",
    iframeWidth: 600,
  });
  const [isDataReceived, setIsDataReceived] = useState(false);

  // Función para enviar mensajes al padre
  const sendMessageToParent = (message: any) => {
    if (window.parent && window.parent !== window) {
      // Enviar al origen del padre (document.location.origin)
      window.parent.postMessage(message, document.location.origin);
    }
  };

  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      // console.log("Mensaje recibido del padre:", event.data);

      switch (event.data.type) {
        case "cliCod":
          setUserData((prev: UserData) => ({
            ...prev,
            CliCod: event.data.cliCod,
          }));
          break;
        case "prdCod":
          setUserData((prev: UserData) => ({
            ...prev,
            PrdCod: event.data.prdCod,
          }));
          break;
        // Email and userName are now extracted from token
        // case "email":
        //   setUserData((prev: UserData) => ({
        //     ...prev,
        //     Email: event.data.email,
        //   }));
        //   break;
        // case "userName":
        //   setUserData((prev: UserData) => ({
        //     ...prev,
        //     userName: event.data.userName,
        //   }));
        //   break;
        case "token":
          const token = event.data.token;
          const tokenPayload = TokenService.decodeToken(token);

          if (tokenPayload) {
            console.log("Token desencriptado:", tokenPayload);
            setUserData((prev: UserData) => ({
              ...prev,
              token: token,
              tokenPayload: tokenPayload,
            }));
          } else {
            console.error("Error al desencriptar el token");
            setUserData((prev: UserData) => ({
              ...prev,
              token: token,
            }));
          }
          break;

        default:
        // console.log("Tipo de mensaje no manejado:", event.data.type);
      }

      // Marcar como recibido si tenemos los datos básicos
      if (event.data.type === "cliCod" || event.data.type === "prdCod") {
        setIsDataReceived(true);
      }
    };

    window.addEventListener("message", handleParentMessage);

    // Notificar al padre que el iframe está listo
    // sendMessageToParent({
    //   type: "SESSION_STARTED",
    //   data: { ready: true },
    // });

    return () => {
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  // Notificar cuando los datos cambien
  useEffect(() => {
    if (isDataReceived && onDataReceived) {
      onDataReceived(userData);
    }
  }, [isDataReceived, userData, onDataReceived]);

  return {
    userData,
    isDataReceived,
    sendMessageToParent,
  };
};
