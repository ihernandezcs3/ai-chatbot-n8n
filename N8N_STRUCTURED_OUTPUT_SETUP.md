# Configuración del Structured Output Parser en n8n

## Paso a Paso para Configurar

### 1. Crear el Nodo "Structured Output Parser"

1. **Agregar nodo**: Busca "Structured Output Parser" en la biblioteca de nodos
2. **Configurar**: Haz clic en el nodo para abrir la configuración

### 2. Configurar el Schema JSON

#### Opción A: Usar el Schema Completo
```json
{
  "$id": "https://ai-chatbot-n8n.com/quickanswer.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "QuickAnswer Response",
  "description": "Schema for generating quick answer suggestions in chat interface",
  "type": "object",
  "properties": {
    "quickAnswers": {
      "type": "array",
      "description": "Array of quick answer suggestions",
      "minItems": 1,
      "maxItems": 8,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the quick answer",
            "pattern": "^[a-zA-Z0-9_-]+$",
            "minLength": 3,
            "maxLength": 50
          },
          "text": {
            "type": "string",
            "description": "Text that will be displayed to the user",
            "minLength": 1,
            "maxLength": 50
          },
          "type": {
            "type": "string",
            "description": "Type of quick answer that determines styling and behavior",
            "enum": ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"]
          },
          "category": {
            "type": "string",
            "description": "Optional category for grouping quick answers",
            "maxLength": 30
          },
          "priority": {
            "type": "integer",
            "description": "Optional priority for ordering (lower numbers = higher priority)",
            "minimum": 1,
            "maximum": 10
          },
          "metadata": {
            "type": "object",
            "description": "Optional additional data for the quick answer",
            "additionalProperties": true
          }
        },
        "required": ["id", "text", "type"],
        "additionalProperties": false
      }
    },
    "sessionId": {
      "type": "string",
      "description": "Optional session identifier",
      "maxLength": 100
    },
    "userId": {
      "type": "string",
      "description": "Optional user identifier",
      "maxLength": 100
    },
    "timestamp": {
      "type": "string",
      "description": "Optional timestamp in ISO format",
      "format": "date-time"
    }
  },
  "required": ["quickAnswers"],
  "additionalProperties": false
}
```

#### Opción B: Schema Simplificado (Solo campos requeridos)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "quickAnswers": {
      "type": "array",
      "minItems": 1,
      "maxItems": 6,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-zA-Z0-9_-]+$"
          },
          "text": {
            "type": "string",
            "maxLength": 50
          },
          "type": {
            "type": "string",
            "enum": ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"]
          },
          "category": {
            "type": "string"
          }
        },
        "required": ["id", "text", "type"]
      }
    }
  },
  "required": ["quickAnswers"]
}
```

### 3. Configurar el Prompt

#### Prompt Completo para el Nodo AI
```
Genera 3-6 sugerencias de preguntas y respuestas rápidas (Quick Answers) basadas en el contexto de la conversación actual. Las opciones deben ser relevantes, útiles y variadas.

## Contexto de la Conversación

**Tema actual:** {{$json.topic}}
**Último mensaje del usuario:** {{$json.lastUserMessage}}
**Última respuesta de la IA:** {{$json.lastAIResponse}}
**Tipo de usuario:** {{$json.userType}}
**Categoría de consulta:** {{$json.queryCategory}}

## Tipos de Quick Answers Disponibles

### 1. `question` (❓) - Preguntas
- Para consultas específicas: "¿Cómo puedo...?", "¿Cuál es...?", "¿Dónde encuentro...?"
- Ejemplos: "¿Cuáles son los precios?", "¿Cómo funciona esto?"

### 2. `answer` (💡) - Respuestas
- Para proporcionar información: "Aquí tienes...", "La respuesta es..."
- Ejemplos: "Aquí tienes la información", "Te explico paso a paso"

### 3. `confirmation` (✅) - Confirmaciones
- Para respuestas afirmativas: "Sí, correcto", "Perfecto", "Estoy de acuerdo"
- Ejemplos: "Sí, procedo con eso", "Perfecto, entiendo"

### 4. `negation` (❌) - Negaciones
- Para respuestas negativas: "No, gracias", "No es lo que busco"
- Ejemplos: "No, necesito algo diferente", "No entiendo bien"

### 5. `suggestion` (💭) - Sugerencias
- Para proponer alternativas: "Te sugiero...", "Podrías probar..."
- Ejemplos: "Te sugiero revisar esto", "Podrías intentar otra opción"

### 6. `action` (⚡) - Acciones
- Para acciones específicas: "Ver perfil", "Descargar", "Contactar"
- Ejemplos: "Ver mi cuenta", "Descargar documento", "Contactar soporte"

### 7. `help` (🆘) - Ayuda
- Para solicitar asistencia: "Necesito ayuda", "No entiendo"
- Ejemplos: "Necesito más ayuda", "Contactar técnico"

## Reglas de Generación

### 1. **Cantidad**: Entre 3-6 quick answers
### 2. **Variedad**: Usa al menos 3 tipos diferentes
### 3. **Relevancia**: Basadas en el contexto actual
### 4. **Claridad**: Texto directo y comprensible
### 5. **Longitud**: Máximo 50 caracteres por texto
### 6. **IDs únicos**: Identificadores descriptivos

## Estrategias por Contexto

### Para Consultas de Productos:
- Incluir preguntas sobre características, precios, disponibilidad
- Agregar acciones como "Ver catálogo", "Solicitar demo"
- Considerar opciones de soporte

### Para Problemas Técnicos:
- Incluir opciones de diagnóstico
- Agregar acciones de soporte
- Considerar guías y documentación

### Para Confirmaciones:
- Siempre incluir confirmación y negación
- Agregar opciones de modificación
- Considerar ayuda adicional

### Para Información General:
- Incluir preguntas de seguimiento
- Agregar opciones para más detalles
- Considerar acciones relacionadas

**RESPONDE ÚNICAMENTE CON EL JSON VÁLIDO SEGÚN EL SCHEMA PROPORCIONADO.**
```

#### Prompt Simplificado
```
Genera 3-6 sugerencias de preguntas/respuestas rápidas basadas en este contexto:

Contexto: {{$json.context}}
Último mensaje: {{$json.lastMessage}}

Responde ÚNICAMENTE con JSON válido que contenga un array de quickAnswers con id, text, type y category opcional.

Tipos disponibles: question, answer, confirmation, negation, suggestion, action, help
```

### 4. Configuración del Nodo AI

#### Configuración Recomendada:
- **Modelo**: GPT-3.5-turbo o GPT-4
- **Temperatura**: 0.7 (para variedad)
- **Max Tokens**: 500
- **Top P**: 0.9
- **Frequency Penalty**: 0.1
- **Presence Penalty**: 0.1

### 5. Flujo Completo en n8n

#### Estructura del Flujo:
```
Trigger → Extraer Contexto → AI (Structured Output) → Validar → Enviar a API
```

#### Nodo 1: Extraer Contexto
```javascript
// Extraer información relevante de la conversación
const data = $input.all()[0].json;

return {
  topic: data.topic || "general",
  lastUserMessage: data.lastUserMessage || "",
  lastAIResponse: data.lastAIResponse || "",
  userType: data.userType || "general",
  queryCategory: data.queryCategory || "general",
  sessionId: data.sessionId,
  userId: data.userId
};
```

#### Nodo 2: AI con Structured Output
- **Prompt**: Usar el prompt completo o simplificado
- **Schema**: Usar el JSON schema proporcionado
- **Output**: Estructura validada automáticamente

#### Nodo 3: Validar y Limpiar
```javascript
// Validar que la respuesta sea correcta
const response = $input.all()[0].json;

// Agregar timestamp si no existe
if (!response.timestamp) {
  response.timestamp = new Date().toISOString();
}

// Agregar sessionId y userId si están disponibles
if ($json.sessionId && !response.sessionId) {
  response.sessionId = $json.sessionId;
}

if ($json.userId && !response.userId) {
  response.userId = $json.userId;
}

return response;
```

#### Nodo 4: Enviar a API
```javascript
// Configuración HTTP Request
{
  "method": "POST",
  "url": "https://tu-dominio.com/api/quickanswer",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": $json
}
```

### 6. Configuración Avanzada

#### Validación Adicional
```javascript
// Validar que haya variedad de tipos
const types = $json.quickAnswers.map(qa => qa.type);
const uniqueTypes = [...new Set(types)];

if (uniqueTypes.length < 2) {
  // Agregar tipos faltantes
  const allTypes = ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"];
  const missingTypes = allTypes.filter(type => !uniqueTypes.includes(type));
  
  // Agregar quick answers faltantes
  missingTypes.slice(0, 2).forEach((type, index) => {
    $json.quickAnswers.push({
      id: `fallback-${type}-${index}`,
      text: getDefaultTextForType(type),
      type: type,
      category: "general"
    });
  });
}

function getDefaultTextForType(type) {
  const defaults = {
    question: "¿Más información?",
    answer: "Entiendo",
    confirmation: "Sí, correcto",
    negation: "No, gracias",
    suggestion: "Te sugiero otra opción",
    action: "Ver más opciones",
    help: "Necesito ayuda"
  };
  return defaults[type] || "Opción adicional";
}

return $json;
```

### 7. Testing y Debugging

#### Test con Datos de Ejemplo
```javascript
// Datos de prueba
{
  "topic": "soporte técnico",
  "lastUserMessage": "Mi aplicación no funciona",
  "lastAIResponse": "Te ayudo a solucionarlo. Primero necesito más información sobre el problema.",
  "userType": "usuario_básico",
  "queryCategory": "support",
  "sessionId": "test-session-123",
  "userId": "user-456"
}
```

#### Respuesta Esperada
```json
{
  "quickAnswers": [
    {
      "id": "tech-details",
      "text": "Proporcionar más detalles",
      "type": "question",
      "category": "support"
    },
    {
      "id": "tech-guide",
      "text": "Ver guía de solución",
      "type": "action",
      "category": "support"
    },
    {
      "id": "tech-contact",
      "text": "Contactar técnico",
      "type": "action",
      "category": "support"
    },
    {
      "id": "tech-understand",
      "text": "No entiendo la solución",
      "type": "negation",
      "category": "support"
    }
  ],
  "sessionId": "test-session-123",
  "userId": "user-456",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 8. Monitoreo

#### Logs Importantes
```javascript
// Registrar generación exitosa
console.log('Quick Answers Generated Successfully:', {
  sessionId: $json.sessionId,
  count: $json.quickAnswers.length,
  types: $json.quickAnswers.map(qa => qa.type),
  timestamp: new Date().toISOString()
});
```

#### Métricas a Seguir
- Tiempo de generación
- Tasa de éxito de validación
- Variedad de tipos generados
- Errores de schema 