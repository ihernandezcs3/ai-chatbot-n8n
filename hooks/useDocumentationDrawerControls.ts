import { useState, useEffect, useCallback } from "react";

interface UseDocumentationDrawerControlsProps {
  onToggleDrawer: (isOpen: boolean) => void;
  setDrawerWidth: (width: number) => void;
}

export const useDocumentationDrawerControls = ({ onToggleDrawer, setDrawerWidth }: UseDocumentationDrawerControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para CERRAR el drawer - notifica al padre para que oculte el iframe
  const closeDrawer = useCallback(() => {
    window.parent.postMessage({ type: "toggleDrawer", isOpen: false }, "*");
  }, []);

  // Escuchar mensajes del padre
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      switch (event.data.type) {
        case "toggleExpand":
          setIsExpanded(event.data.isOpen);
          break;
        case "iframeWidth":
          setDrawerWidth(event.data.width);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setDrawerWidth]);

  const toggleExpand = useCallback(() => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    window.parent.postMessage({ type: "expandToggle", isOpen: newIsExpanded }, "*");
  }, [isExpanded]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Función para manejar enlaces internos
  const openInternalLink = useCallback((pathname: string) => {
    window.parent.postMessage({ type: "openInternalLink", messageContent: `internal:${pathname}` }, "*");
  }, []);

  return {
    isExpanded,
    isMenuOpen,
    closeDrawer,
    toggleExpand,
    toggleMenu,
    openInternalLink,
  };
};
