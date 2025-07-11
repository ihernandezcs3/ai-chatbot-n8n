import { useState, useEffect, useCallback } from "react";

interface UseDocumentationDrawerControlsProps {
  initialIsOpen: boolean;
  initialIsExpanded: boolean;
  onToggleDrawer: (isOpen: boolean) => void;
  setDrawerWidth: (width: number) => void;
  functionKey?: string; // Tecla de acceso rápido configurable
}

export const useDocumentationDrawerControls = ({
  initialIsOpen,
  initialIsExpanded,
  onToggleDrawer,
  setDrawerWidth,
  functionKey = "F2", // Valor por defecto
}: UseDocumentationDrawerControlsProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFunctionKey, setCurrentFunctionKey] = useState(functionKey);

  const toggleDrawer = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggleDrawer(newIsOpen);
    // Solo aquí se envía el mensaje al padre
    window.parent.postMessage({ type: "toggleDrawer", isOpen: newIsOpen }, "*");
  }, [isOpen, onToggleDrawer]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(event.data);
      // Solo actualizar estado, no enviar mensajes al padre
      if (event.data && event.data.type === "toggleDrawer") {
        setIsOpen(event.data.isOpen);
        onToggleDrawer(event.data.isOpen);
      }
      if (event.data && event.data.type === "toggleExpand") {
        setIsExpanded(event.data.isOpen);
      }
      if (event.data && event.data.type === "iframeWidth") {
        setDrawerWidth(event.data.width);
      }
      if (event.data && event.data.type === "functionKey") {
        setCurrentFunctionKey(event.data.functionKey);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onToggleDrawer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === currentFunctionKey) {
        event.preventDefault();
        toggleDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFunctionKey, toggleDrawer]);

  const toggleExpand = useCallback(() => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    window.parent.postMessage(
      { type: "expandToggle", isOpen: newIsExpanded },
      "*"
    );
  }, [isExpanded]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Función para manejar enlaces internos que el JavaScript espera
  const openInternalLink = useCallback((pathname: string) => {
    window.parent.postMessage(
      { type: "openInternalLink", messageContent: `internal:${pathname}` },
      "*"
    );
  }, []);

  return {
    isOpen,
    isExpanded,
    isMenuOpen,
    toggleDrawer,
    toggleExpand,
    toggleMenu,
    openInternalLink,
    currentFunctionKey, // Exponer la tecla actual
  };
};
