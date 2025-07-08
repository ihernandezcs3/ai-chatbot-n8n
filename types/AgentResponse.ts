/* -------------------------------------------------
 *  Tipado principal de la respuesta del SAC_AGENT
 * -------------------------------------------------*/
export interface SacAgentResponse {
  /** Texto final que el agente devuelve al usuario */
  output: string;

  /** Acciones ejecutadas (ya procesadas o resumidas)  */
  actions: SacAction[];

  /**
   * Pasos intermedios opcionales, útiles para debug o
   * para re-enriquecer la respuesta en un pipeline
   */
  intermediateSteps?: IntermediateStep[];

  /**
   * Componentes dinámicos opcionales para renderizar UI
   * en lugar de texto simple
   */
  components?: ComponentData[];
}

/* ------------------------------
 *  Tipos auxiliares
 * -----------------------------*/

/** Acción concreta que el agente ejecutó */
export interface SacAction {
  /** Herramienta invocada (p.ej. "documents", "crear_ticket") */
  tool: string;

  /** Entrada enviada a la herramienta */
  toolInput: unknown;

  /** ID de llamada, suele venir vacío si no lo gestionás */
  toolCallId?: string;

  /** Log consolidado del paso (texto plano) */
  log?: string;

  /** Historial de mensajes/parciales que devolvió el modelo */
  messageLog?: MessageChunk[];
}

/** Paso intermedio que conserva la acción y su observación */
export interface IntermediateStep {
  action: SacAction;
  /** Resultado o feedback que devolvió la herramienta */
  observation: unknown;
}

/** Estructura típica de los "chunks" que LangChain emite */
export interface MessageChunk {
  lc: number;
  type: string; // "constructor", "chunk", etc.
  id: string[];
  kwargs: Record<string, unknown>;
}

/** Estructura para componentes dinámicos */
export interface ComponentData {
  type: string;
  props?: Record<string, any>;
  content?: string;
  children?: ComponentData[];
}

/* ------------------------------
 *  Tipos para comunicación con postMessage
 * -----------------------------*/

/** Datos que se reciben desde la aplicación padre */
export interface ParentAppData {
  CliCod: number;
  PrdCod: number;
  Email: string;
  userName?: string;
}

/** Tipos de mensajes que se pueden recibir */
export type ParentMessageType = "INIT_DATA" | "UPDATE_DATA" | "RESET_SESSION";

/** Estructura del mensaje recibido desde el padre */
export interface ParentMessage {
  type: ParentMessageType;
  data?: ParentAppData;
}

/** Estructura del mensaje enviado al padre */
export interface ChildMessage {
  type: "SESSION_STARTED" | "MESSAGE_SENT" | "RESPONSE_RECEIVED" | "ERROR";
  data?: any;
}
