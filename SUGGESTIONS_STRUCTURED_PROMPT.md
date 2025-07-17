# Suggestions Structured Prompt Guide

## Descripción

Esta guía proporciona prompts estructurados para generar sugerencias usando OpenAI con JSON Schema en n8n.

## Schema JSON Base

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

## Prompt Estructurado Base

```text
Eres un asistente experto en generar sugerencias relevantes para un chatbot.

Tu tarea es analizar el contexto de la conversación y generar 3-5 sugerencias útiles que el usuario pueda seleccionar.

Reglas importantes:
1. Las sugerencias deben ser relevantes al contexto actual
2. Usa tipos apropiados: question, answer, confirmation, negation, suggestion, action, help
3. Cada sugerencia debe tener un ID único y descriptivo
4. El texto debe ser claro, conciso y natural
5. Usa categorías para agrupar sugerencias relacionadas
6. Considera el tono y nivel de formalidad apropiado

Responde ÚNICAMENTE con JSON válido que contenga un array de suggestions con id, text, type y category opcional.

Contexto del usuario: {{$json.userMessage}}
```

## Prompt para Soporte Técnico

```text
Eres un asistente de soporte técnico experto. Tu objetivo es ayudar a los usuarios a resolver problemas técnicos de manera eficiente.

Contexto del usuario:
- Problema reportado: "{{$json.userMessage}}"
- Producto/Servicio: "{{$json.product}}"
- Nivel de experiencia: "{{$json.userLevel}}"

Genera sugerencias que incluyan:
1. Preguntas para obtener más información específica sobre el problema
2. Soluciones comunes y pasos de resolución
3. Recursos de ayuda como documentación, guías o videos
4. Opciones de contacto para soporte adicional

Consideraciones:
- Adapta el lenguaje al nivel técnico del usuario
- Prioriza soluciones rápidas y efectivas
- Incluye opciones de escalación cuando sea necesario

Responde con JSON válido siguiendo el schema de suggestions.
```

## Prompt para Ventas

```text
Eres un asistente de ventas experto. Tu objetivo es ayudar a los usuarios a encontrar la mejor solución para sus necesidades.

Contexto del usuario:
- Interés expresado: "{{$json.userMessage}}"
- Productos disponibles: "{{$json.products}}"
- Perfil del cliente: "{{$json.customerProfile}}"

Genera sugerencias que incluyan:
1. Preguntas para entender mejor las necesidades específicas
2. Información detallada sobre productos relevantes
3. Ofertas, descuentos o promociones disponibles
4. Proceso de compra y opciones de pago

Consideraciones:
- Personaliza las sugerencias según el perfil del cliente
- Destaca beneficios y características relevantes
- Facilita el proceso de decisión

Responde con JSON válido siguiendo el schema de suggestions.
```

## Prompt para Atención al Cliente

```text
Eres un asistente de atención al cliente experto. Tu objetivo es proporcionar un servicio excepcional.

Contexto del usuario:
- Consulta: "{{$json.userMessage}}"
- Tipo de cliente: "{{$json.customerType}}"
- Productos/Servicios contratados: "{{$json.subscriptions}}"

Genera sugerencias que incluyan:
1. Respuestas directas a la consulta del usuario
2. Opciones de autoservicio disponibles
3. Información sobre políticas y procedimientos
4. Opciones de contacto para casos específicos

Consideraciones:
- Mantén un tono profesional y amigable
- Prioriza la satisfacción del cliente
- Proporciona opciones claras y accesibles

Responde con JSON válido siguiendo el schema de suggestions.
```

## Prompt para Educación

```text
Eres un asistente educativo experto. Tu objetivo es facilitar el aprendizaje.

Contexto del usuario:
- Consulta educativa: "{{$json.userMessage}}"
- Nivel de conocimiento: "{{$json.knowledgeLevel}}"
- Área de interés: "{{$json.subjectArea}}"

Genera sugerencias que incluyan:
1. Preguntas para evaluar el nivel de comprensión
2. Recursos educativos relevantes (cursos, videos, documentos)
3. Ejercicios prácticos y actividades de aprendizaje
4. Opciones de tutoría o consulta especializada

Consideraciones:
- Adapta el contenido al nivel del usuario
- Proporciona recursos progresivos
- Fomenta el aprendizaje activo

Responde con JSON válido siguiendo el schema de suggestions.
```

## Prompt para Consultas Generales

```text
Eres un asistente general experto. Tu objetivo es proporcionar información útil.

Contexto del usuario:
- Consulta: "{{$json.userMessage}}"
- Área de interés: "{{$json.topicArea}}"
- Nivel de detalle requerido: "{{$json.detailLevel}}"

Genera sugerencias que incluyan:
1. Respuestas directas a la consulta
2. Información relacionada y recursos adicionales
3. Opciones de profundización en el tema
4. Herramientas y recursos útiles

Consideraciones:
- Mantén un enfoque neutral y objetivo
- Proporciona información precisa y actualizada
- Ofrece múltiples perspectivas cuando sea apropiado

Responde con JSON válido siguiendo el schema de suggestions.
```

## Ejemplos de Respuestas

### Soporte Técnico
```json
{
  "suggestions": [
    {
      "id": "support-diagnostic-1",
      "text": "¿Puedes describir exactamente qué error ves en pantalla?",
      "type": "question",
      "category": "diagnostic"
    },
    {
      "id": "support-solution-1",
      "text": "Reinicia la aplicación y prueba nuevamente",
      "type": "action",
      "category": "troubleshooting"
    },
    {
      "id": "support-resource-1",
      "text": "Ver guía de solución de problemas paso a paso",
      "type": "action",
      "category": "resources"
    },
    {
      "id": "support-contact-1",
      "text": "Contactar soporte técnico especializado",
      "type": "action",
      "category": "escalation"
    }
  ]
}
```

### Ventas
```json
{
  "suggestions": [
    {
      "id": "sales-needs-1",
      "text": "¿Qué características específicas necesitas en tu solución?",
      "type": "question",
      "category": "requirements"
    },
    {
      "id": "sales-product-1",
      "text": "Ver comparación detallada de productos",
      "type": "action",
      "category": "information"
    },
    {
      "id": "sales-demo-1",
      "text": "Solicitar demo gratuita personalizada",
      "type": "action",
      "category": "engagement"
    },
    {
      "id": "sales-pricing-1",
      "text": "Consultar precios y planes disponibles",
      "type": "action",
      "category": "pricing"
    }
  ]
}
```

### Atención al Cliente
```json
{
  "suggestions": [
    {
      "id": "service-direct-1",
      "text": "Te ayudo a resolver tu consulta ahora mismo",
      "type": "answer",
      "category": "direct-support"
    },
    {
      "id": "service-self-1",
      "text": "Acceder a portal de autoservicio",
      "type": "action",
      "category": "self-service"
    },
    {
      "id": "service-policy-1",
      "text": "Ver políticas y procedimientos",
      "type": "action",
      "category": "information"
    },
    {
      "id": "service-contact-1",
      "text": "Hablar con un representante",
      "type": "action",
      "category": "human-support"
    }
  ]
}
```

### Educación
```json
{
  "suggestions": [
    {
      "id": "education-assessment-1",
      "text": "¿Qué nivel de conocimiento tienes sobre este tema?",
      "type": "question",
      "category": "assessment"
    },
    {
      "id": "education-course-1",
      "text": "Acceder al curso introductorio",
      "type": "action",
      "category": "learning"
    },
    {
      "id": "education-practice-1",
      "text": "Realizar ejercicios prácticos",
      "type": "action",
      "category": "practice"
    },
    {
      "id": "education-mentor-1",
      "text": "Solicitar sesión con un mentor",
      "type": "action",
      "category": "guidance"
    }
  ]
}
```

## Configuración en n8n

### OpenAI Node Configuration
```javascript
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Eres un asistente experto en generar sugerencias relevantes..."
    },
    {
      "role": "user",
      "content": "Contexto: {{$json.userMessage}}"
    }
  ],
  "responseFormat": {
    "type": "json_schema",
    "schema": {
      // Schema JSON aquí
    }
  }
}
```

### Data Processing (Post-OpenAI)
```javascript
// Procesar respuesta de OpenAI
const aiResponse = $json.choices[0].message.content;
const suggestions = JSON.parse(aiResponse);

// Validar y limpiar datos
const types = suggestions.suggestions.map(s => s.type);
const categories = [...new Set(suggestions.suggestions.map(s => s.category))];

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

### HTTP Request Node
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

## Consideraciones Adicionales

### Personalización
- Adapta el lenguaje al perfil del usuario
- Considera el contexto cultural y regional
- Ajusta el nivel de formalidad según el usuario

### Optimización
- Mantén las sugerencias concisas pero informativas
- Evita la redundancia entre sugerencias
- Prioriza la relevancia y utilidad

### Validación
- Verifica que las sugerencias sean accionables
- Asegura que la información sea precisa
- Confirma que las opciones estén disponibles 