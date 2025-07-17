# N8N Suggestions Integration Guide

## Descripción

Esta guía explica cómo integrar el sistema de sugerencias con n8n para enviar sugerencias dinámicas al chatbot.

## Configuración Básica

### 1. HTTP Request Node

**Configuración:**
- **Método**: POST
- **URL**: `https://tu-dominio.com/api/suggestions`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "suggestions": "{{$json.suggestions}}",
    "sessionId": "{{$json.sessionId}}",
    "userId": "{{$json.userId}}"
  }
  ```

### 2. Ejemplo de Flujo Completo

```javascript
// Trigger: Webhook o Schedule
const trigger = $input.first();

// Process: Generar sugerencias basadas en el contexto
const context = $json.context;
const suggestions = generateSuggestions(context);

// HTTP Request: Enviar a la API
const response = await $http.post({
  url: "https://tu-dominio.com/api/suggestions",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    suggestions: suggestions,
    sessionId: $json.sessionId,
    userId: $json.userId
  }
});

return response;
```

## Funciones de Generación de Sugerencias

### Función Básica
```javascript
function generateSuggestions(context) {
  const suggestions = [
    {
      id: "1",
      text: "¿Cómo puedo ayudarte?",
      type: "question",
      category: "general"
    },
    {
      id: "2", 
      text: "Necesito información",
      type: "suggestion",
      category: "general"
    }
  ];
  
  return suggestions;
}
```

### Función con Categorías
```javascript
function generateCategorizedSuggestions(context) {
  const supportSuggestions = [
    {
      id: "support-1",
      text: "Necesito ayuda técnica",
      type: "suggestion",
      category: "support"
    },
    {
      id: "support-2",
      text: "¿Cómo reportar un problema?",
      type: "question",
      category: "support"
    }
  ];

  const salesSuggestions = [
    {
      id: "sales-1",
      text: "Quiero ver los precios",
      type: "suggestion",
      category: "sales"
    },
    {
      id: "sales-2",
      text: "¿Tienen descuentos?",
      type: "question",
      category: "sales"
    }
  ];

  return [...supportSuggestions, ...salesSuggestions];
}
```

### Función con Cache
```javascript
async function getCachedSuggestions(cacheKey) {
  const cached = await $cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const suggestions = generateSuggestions();
  await $cache.set(cacheKey, suggestions, 300); // 5 minutos
  return suggestions;
}
```

### Función Personalizada
```javascript
function generatePersonalizedSuggestions(userProfile) {
  const suggestions = [];
  
  if (userProfile.role === "admin") {
    suggestions.push({
      id: "admin-1",
      text: "Configurar sistema",
      type: "action",
      category: "admin"
    });
  }
  
  if (userProfile.department === "sales") {
    suggestions.push({
      id: "sales-1",
      text: "Ver reportes de ventas",
      type: "suggestion",
      category: "sales"
    });
  }
  
  return suggestions;
}
```

### Función con Variantes
```javascript
function generateVariantSuggestions(variant) {
  const variants = {
    formal: [
      {
        id: "formal-1",
        text: "¿Podría proporcionarme más información?",
        type: "question",
        category: "formal"
      }
    ],
    casual: [
      {
        id: "casual-1",
        text: "¿Me puedes dar más info?",
        type: "question",
        category: "casual"
      }
    ]
  };
  
  return variants[variant] || variants.casual;
}
```

## Flujos Avanzados

### 1. Sugerencias Basadas en IA
```javascript
// Usar OpenAI para generar sugerencias contextuales
const aiResponse = await $openai.createCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "Genera 3 sugerencias relevantes para el contexto del usuario"
    },
    {
      role: "user", 
      content: context.userMessage
    }
  ]
});

const suggestions = parseAIResponse(aiResponse);
```

### 2. Sugerencias con Prioridad
```javascript
function generatePrioritizedSuggestions(context) {
  const suggestions = [
    {
      id: "urgent-1",
      text: "Reportar problema crítico",
      type: "action",
      category: "urgent",
      priority: 1
    },
    {
      id: "normal-1",
      text: "Consulta general",
      type: "question",
      category: "general",
      priority: 2
    }
  ];
  
  return suggestions.sort((a, b) => a.priority - b.priority);
}
```

### 3. Sugerencias Dinámicas
```javascript
function generateDynamicSuggestions(context) {
  const suggestions = [];
  
  // Basado en la hora del día
  const hour = new Date().getHours();
  if (hour < 12) {
    suggestions.push({
      id: "morning-1",
      text: "Buenos días, ¿en qué puedo ayudarte?",
      type: "greeting",
      category: "time-based"
    });
  }
  
  // Basado en el historial del usuario
  if (context.userHistory.includes("support")) {
    suggestions.push({
      id: "support-followup",
      text: "¿Necesitas más ayuda con el soporte?",
      type: "question",
      category: "followup"
    });
  }
  
  return suggestions;
}
```

## Manejo de Errores

### Validación de Respuesta
```javascript
try {
  const response = await $http.post({
    url: "https://tu-dominio.com/api/suggestions",
    body: { suggestions: suggestions }
  });
  
  if (response.status === 200) {
    console.log("Suggestions sent successfully");
    return {
      success: true,
      count: suggestions.length,
      types: suggestions.map(s => s.type)
    };
  } else {
    throw new Error(`HTTP ${response.status}: ${response.body}`);
  }
} catch (error) {
  console.error("Error sending suggestions:", error);
  return {
    success: false,
    error: error.message
  };
}
```

### Fallback de Sugerencias
```javascript
function getDefaultSuggestions() {
  return [
    {
      id: "default-1",
      text: "¿Cómo puedo ayudarte?",
      type: "question",
      category: "default"
    },
    {
      id: "default-2",
      text: "Necesito información",
      type: "suggestion",
      category: "default"
    }
  ];
}

// En caso de error, usar sugerencias por defecto
const suggestions = await generateSuggestions(context) || getDefaultSuggestions();
```

## Monitoreo y Logging

### Logging de Sugerencias
```javascript
const logData = {
  timestamp: new Date().toISOString(),
  sessionId: $json.sessionId,
  userId: $json.userId,
  count: suggestions.length,
  types: suggestions.map(s => s.type),
  categories: [...new Set(suggestions.map(s => s.category))]
};

console.log("Suggestions sent:", logData);
```

### Métricas
```javascript
const metrics = {
  suggestionsSent: suggestions.length,
  uniqueTypes: new Set(suggestions.map(s => s.type)).size,
  uniqueCategories: new Set(suggestions.map(s => s.category)).size,
  timestamp: new Date().toISOString()
};

// Enviar métricas a sistema de monitoreo
await $http.post({
  url: "https://analytics.com/metrics",
  body: metrics
});
```

## Ejemplos de Implementación

### Ejemplo 1: Sugerencias de Soporte
```javascript
const supportSuggestions = [
  {
    id: "support-1",
    text: "Necesito ayuda técnica",
    type: "suggestion",
    category: "support"
  },
  {
    id: "support-2", 
    text: "¿Cómo reportar un problema?",
    type: "question",
    category: "support"
  },
  {
    id: "support-3",
    text: "Ver documentación",
    type: "action",
    category: "support"
  }
];

return await sendSuggestions(supportSuggestions);
```

### Ejemplo 2: Sugerencias de Ventas
```javascript
const salesSuggestions = [
  {
    id: "sales-1",
    text: "Quiero ver los precios",
    type: "suggestion",
    category: "sales"
  },
  {
    id: "sales-2",
    text: "¿Tienen descuentos?",
    type: "question",
    category: "sales"
  },
  {
    id: "sales-3",
    text: "Contactar vendedor",
    type: "action",
    category: "sales"
  }
];

return await sendSuggestions(salesSuggestions);
```

### Ejemplo 3: Sugerencias Personalizadas
```javascript
const userProfile = $json.userProfile;
const suggestions = generatePersonalizedSuggestions(userProfile);

const response = await $http.post({
  url: "https://tu-dominio.com/api/suggestions",
  body: {
    suggestions: suggestions,
    sessionId: $json.sessionId,
    userId: userProfile.id
  }
});

return {
  success: true,
  count: suggestions.length,
  types: suggestions.map(s => s.type)
};
``` 