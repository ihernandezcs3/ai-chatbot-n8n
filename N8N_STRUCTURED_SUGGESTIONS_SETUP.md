# N8N Structured Suggestions Setup

## Descripción

Esta guía explica cómo configurar n8n para generar sugerencias estructuradas usando OpenAI y enviarlas al chatbot.

## Schema JSON para OpenAI

### Schema Básico
```json
{
  "$id": "https://ai-chatbot-n8n.com/suggestions.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Suggestions Response",
  "description": "Schema for suggestions response from AI chatbot",
  "type": "object",
  "properties": {
    "suggestions": {
      "type": "array",
      "description": "Array of suggestion objects",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the suggestion"
          },
          "text": {
            "type": "string",
            "description": "The suggestion text to display"
          },
          "type": {
            "type": "string",
            "enum": ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"],
            "description": "Type of suggestion"
          },
          "category": {
            "type": "string",
            "description": "Optional category for grouping suggestions"
          },
          "priority": {
            "type": "number",
            "description": "Optional priority for ordering suggestions"
          },
          "metadata": {
            "type": "object",
            "description": "Optional additional metadata"
          }
        },
        "required": ["id", "text", "type"],
        "additionalProperties": false
      },
      "minItems": 1,
      "maxItems": 10
    }
  },
  "required": ["suggestions"]
}
```

### Schema Extendido
```json
{
  "$id": "https://ai-chatbot-n8n.com/suggestions-extended.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Extended Suggestions Response",
  "description": "Extended schema for suggestions with additional context",
  "type": "object",
  "properties": {
    "suggestions": {
      "type": "array",
      "description": "Array of suggestion objects",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the suggestion"
          },
          "text": {
            "type": "string",
            "description": "The suggestion text to display"
          },
          "type": {
            "type": "string",
            "enum": ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"],
            "description": "Type of suggestion"
          },
          "category": {
            "type": "string",
            "description": "Optional category for grouping suggestions"
          },
          "priority": {
            "type": "number",
            "description": "Optional priority for ordering suggestions"
          },
          "metadata": {
            "type": "object",
            "description": "Optional additional metadata"
          }
        },
        "required": ["id", "text", "type"],
        "additionalProperties": false
      },
      "minItems": 1,
      "maxItems": 10
    },
    "context": {
      "type": "object",
      "description": "Additional context about the suggestions",
      "properties": {
        "intent": {
          "type": "string",
          "description": "Detected user intent"
        },
        "confidence": {
          "type": "number",
          "description": "Confidence score for the suggestions"
        },
        "reasoning": {
          "type": "string",
          "description": "Reasoning behind the suggestions"
        }
      }
    }
  },
  "required": ["suggestions"]
}
```

## Configuración de OpenAI en n8n

### 1. OpenAI Node Configuration

**Configuración básica:**
- **Model**: `gpt-3.5-turbo` o `gpt-4`
- **Messages**: Array de mensajes del sistema y usuario
- **Response Format**: JSON Schema
- **Schema**: El schema JSON definido arriba

### 2. Prompt del Sistema

```text
Eres un asistente experto en generar sugerencias relevantes para un chatbot. 

Tu tarea es analizar el contexto de la conversación y generar 3-5 sugerencias útiles que el usuario pueda seleccionar.

Reglas importantes:
1. Las sugerencias deben ser relevantes al contexto actual
2. Usa tipos apropiados: question, answer, confirmation, negation, suggestion, action, help
3. Cada sugerencia debe tener un ID único
4. El texto debe ser claro y conciso
5. Usa categorías para agrupar sugerencias relacionadas

Responde ÚNICAMENTE con JSON válido que contenga un array de suggestions con id, text, type y category opcional.
```

### 3. Prompt del Usuario

```text
Contexto de la conversación:
- Último mensaje del usuario: "{{$json.userMessage}}"
- Historial de la conversación: {{$json.conversationHistory}}
- Perfil del usuario: {{$json.userProfile}}

Genera sugerencias relevantes basadas en este contexto.
```

## Flujo Completo en n8n

### 1. Trigger Node
```javascript
// Webhook trigger o schedule
const trigger = $input.first();
return trigger;
```

### 2. Data Processing Node
```javascript
// Preparar datos para OpenAI
const context = {
  userMessage: $json.lastMessage,
  conversationHistory: $json.history,
  userProfile: $json.profile,
  sessionId: $json.sessionId
};

return context;
```

### 3. OpenAI Node
```javascript
// Configuración del nodo OpenAI
const openaiConfig = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "Eres un asistente experto en generar sugerencias relevantes..."
    },
    {
      role: "user", 
      content: `Contexto: ${JSON.stringify($json)}`
    }
  ],
  responseFormat: {
    type: "json_schema",
    schema: {
      // Schema JSON aquí
    }
  }
};

return openaiConfig;
```

### 4. Data Processing (Post-OpenAI)
```javascript
// Procesar respuesta de OpenAI
const aiResponse = $json.choices[0].message.content;
const suggestions = JSON.parse(aiResponse);

// Validar y limpiar datos
const types = suggestions.suggestions.map(s => s.type);
const categories = [...new Set(suggestions.suggestions.map(s => s.category))];

// Agregar metadatos adicionales
suggestions.suggestions.push({
  id: "fallback-1",
  text: "¿Puedes ayudarme con algo más?",
  type: "question",
  category: "fallback"
});

return {
  suggestions: suggestions.suggestions,
  metadata: {
    count: suggestions.suggestions.length,
    types: types,
    categories: categories,
    timestamp: new Date().toISOString()
  }
};
```

### 5. HTTP Request Node
```javascript
// Enviar sugerencias a la API
const response = await $http.post({
  url: "https://tu-dominio.com/api/suggestions",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    suggestions: $json.suggestions,
    sessionId: $json.sessionId,
    userId: $json.userId,
    metadata: $json.metadata
  }
});

return {
  success: response.status === 200,
  response: response.body,
  suggestions: $json.suggestions
};
```

## Ejemplos de Prompts Específicos

### Prompt para Soporte Técnico
```text
Eres un asistente de soporte técnico. Basándote en el problema reportado por el usuario, genera sugerencias útiles.

Contexto:
- Problema: "{{$json.userMessage}}"
- Producto: "{{$json.product}}"
- Nivel de usuario: "{{$json.userLevel}}"

Genera sugerencias que incluyan:
1. Preguntas para obtener más información
2. Soluciones comunes
3. Recursos de ayuda
4. Opciones de contacto

Responde con JSON válido siguiendo el schema de suggestions.
```

### Prompt para Ventas
```text
Eres un asistente de ventas. Basándote en el interés del usuario, genera sugerencias para ayudarle a tomar una decisión.

Contexto:
- Interés: "{{$json.userMessage}}"
- Productos disponibles: "{{$json.products}}"
- Historial de compras: "{{$json.purchaseHistory}}"

Genera sugerencias que incluyan:
1. Preguntas sobre necesidades específicas
2. Información sobre productos
3. Ofertas y descuentos
4. Proceso de compra

Responde con JSON válido siguiendo el schema de suggestions.
```

### Prompt para General
```text
Eres un asistente general. Analiza el mensaje del usuario y genera sugerencias útiles para continuar la conversación.

Contexto:
- Mensaje: "{{$json.userMessage}}"
- Historial: "{{$json.conversationHistory}}"

Genera sugerencias que:
1. Respondan directamente al mensaje
2. Ofrezcan opciones relacionadas
3. Ayuden a clarificar necesidades
4. Proporcionen recursos útiles

Responde con JSON válido siguiendo el schema de suggestions.
```

## Validación y Manejo de Errores

### Validación de Respuesta
```javascript
function validateSuggestions(suggestions) {
  if (!suggestions || !Array.isArray(suggestions)) {
    throw new Error("Invalid suggestions format");
  }
  
  for (const suggestion of suggestions) {
    if (!suggestion.id || !suggestion.text || !suggestion.type) {
      throw new Error("Missing required fields in suggestion");
    }
    
    const validTypes = ["question", "answer", "confirmation", "negation", "suggestion", "action", "help"];
    if (!validTypes.includes(suggestion.type)) {
      throw new Error(`Invalid suggestion type: ${suggestion.type}`);
    }
  }
  
  return suggestions;
}

// Usar en el flujo
try {
  const aiResponse = $json.choices[0].message.content;
  const parsed = JSON.parse(aiResponse);
  const validated = validateSuggestions(parsed.suggestions);
  
  return {
    suggestions: validated,
    success: true
  };
} catch (error) {
  console.error("Validation error:", error);
  
  // Fallback suggestions
  return {
    suggestions: [
      {
        id: "fallback-1",
        text: "¿Cómo puedo ayudarte?",
        type: "question",
        category: "fallback"
      }
    ],
    success: false,
    error: error.message
  };
}
```

### Logging y Monitoreo
```javascript
const logData = {
  timestamp: new Date().toISOString(),
  sessionId: $json.sessionId,
  userMessage: $json.userMessage,
  suggestionsGenerated: $json.suggestions.length,
  types: $json.suggestions.map(s => s.type),
  categories: [...new Set($json.suggestions.map(s => s.category))],
  success: $json.success
};

console.log("Suggestions generated:", logData);

// Enviar métricas
await $http.post({
  url: "https://analytics.com/suggestions",
  body: logData
});
```

## Optimización y Mejores Prácticas

### 1. Cache de Sugerencias
```javascript
// Cache suggestions por contexto similar
const cacheKey = `suggestions:${hash($json.userMessage)}:${hash($json.conversationHistory)}`;
const cached = await $cache.get(cacheKey);

if (cached) {
  return cached;
}

// Generar nuevas sugerencias
const suggestions = await generateSuggestions($json);
await $cache.set(cacheKey, suggestions, 300); // 5 minutos

return suggestions;
```

### 2. Personalización por Usuario
```javascript
function personalizeSuggestions(suggestions, userProfile) {
  return suggestions.map(suggestion => ({
    ...suggestion,
    text: suggestion.text.replace("{{userName}}", userProfile.name),
    metadata: {
      ...suggestion.metadata,
      personalized: true,
      userLevel: userProfile.level
    }
  }));
}
```

### 3. A/B Testing
```javascript
const variant = $json.userId % 2 === 0 ? "A" : "B";
const prompt = variant === "A" ? promptA : promptB;

// Usar prompt específico para la variante
const suggestions = await generateSuggestionsWithPrompt(prompt, $json);
```

## Ejemplos de Respuestas

### Respuesta de Soporte
```json
{
  "suggestions": [
    {
      "id": "support-1",
      "text": "¿Puedes describir el problema con más detalle?",
      "type": "question",
      "category": "support"
    },
    {
      "id": "support-2",
      "text": "Ver guía de solución de problemas",
      "type": "action",
      "category": "support"
    },
    {
      "id": "support-3",
      "text": "Contactar soporte técnico",
      "type": "action",
      "category": "support"
    }
  ]
}
```

### Respuesta de Ventas
```json
{
  "suggestions": [
    {
      "id": "sales-1",
      "text": "¿Qué características específicas necesitas?",
      "type": "question",
      "category": "sales"
    },
    {
      "id": "sales-2",
      "text": "Ver comparación de productos",
      "type": "action",
      "category": "sales"
    },
    {
      "id": "sales-3",
      "text": "Solicitar demo gratuita",
      "type": "action",
      "category": "sales"
    }
  ]
}
``` 