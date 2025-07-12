# Integración Quick Answer en n8n

## Flujo Básico de n8n

### 1. Trigger (Webhook/Manual)
```
Trigger → Procesar Mensaje → Generar Quick Answers → Enviar a API
```

### 2. Nodos Necesarios

#### Nodo 1: Procesar Contexto
```javascript
// Extraer contexto de la conversación
const conversationContext = $input.all()[0].json.context;
const lastMessage = $input.all()[0].json.lastMessage;
const userIntent = $input.all()[0].json.intent;

return {
  context: conversationContext,
  lastMessage: lastMessage,
  userIntent: userIntent
};
```

#### Nodo 2: Generar Quick Answers (OpenAI/ChatGPT)
**Prompt a usar:**
```
Genera 3-6 sugerencias de preguntas/respuestas rápidas basadas en este contexto:

Contexto: {{$json.context}}
Último mensaje: {{$json.lastMessage}}
Intención del usuario: {{$json.userIntent}}

Responde ÚNICAMENTE con JSON válido:

{
  "quickAnswers": [
    {
      "id": "identificador-unico",
      "text": "Texto visible (máx 50 chars)",
      "type": "question|answer|confirmation|negation|suggestion|action|help",
      "category": "categoria-opcional"
    }
  ]
}
```

#### Nodo 3: Enviar a API (HTTP Request)
```javascript
// Configuración del nodo HTTP Request
{
  "method": "POST",
  "url": "https://tu-dominio.com/api/quickanswer",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "quickAnswers": "{{$json.quickAnswers}}",
    "sessionId": "{{$json.sessionId}}",
    "userId": "{{$json.userId}}"
  }
}
```

## Ejemplo de Flujo Completo

### Paso 1: Trigger
- **Tipo**: Webhook
- **Evento**: Cuando la IA responde al usuario

### Paso 2: Extraer Datos
```javascript
// Extraer información relevante
const data = $input.all()[0].json;

return {
  conversationHistory: data.messages,
  currentTopic: data.topic,
  userProfile: data.user,
  sessionId: data.sessionId
};
```

### Paso 3: Preparar Contexto para IA
```javascript
// Crear contexto para la generación de quick answers
const context = {
  topic: $json.currentTopic,
  lastMessages: $json.conversationHistory.slice(-3), // Últimos 3 mensajes
  userType: $json.userProfile.type,
  sessionId: $json.sessionId
};

return {
  context: JSON.stringify(context),
  sessionId: $json.sessionId,
  userId: $json.userProfile.id
};
```

### Paso 4: Generar Quick Answers
- **Modelo**: GPT-3.5-turbo o GPT-4
- **Temperatura**: 0.7 (para variedad)
- **Max Tokens**: 500
- **Prompt**: Usar el prompt conciso de `QUICK_ANSWER_PROMPT_CONCISE.md`

### Paso 5: Validar y Limpiar
```javascript
// Validar que la respuesta sea JSON válido
try {
  const response = $input.all()[0].json;
  const quickAnswers = JSON.parse(response.content || response);
  
  // Validar estructura
  if (!quickAnswers.quickAnswers || !Array.isArray(quickAnswers.quickAnswers)) {
    throw new Error('Invalid structure');
  }
  
  return {
    quickAnswers: quickAnswers.quickAnswers,
    sessionId: $json.sessionId,
    userId: $json.userId
  };
} catch (error) {
  // Fallback a quick answers genéricos
  return {
    quickAnswers: [
      {
        "id": "help-general",
        "text": "¿Cómo puedo ayudarte?",
        "type": "question",
        "category": "general"
      },
      {
        "id": "more-info",
        "text": "Necesito más información",
        "type": "help",
        "category": "general"
      }
    ],
    sessionId: $json.sessionId,
    userId: $json.userId
  };
}
```

### Paso 6: Enviar a API
- **Método**: POST
- **URL**: `https://tu-dominio.com/api/quickanswer`
- **Body**: Los quick answers generados

## Casos de Uso Específicos

### Para Soporte Técnico
```javascript
// Contexto específico para soporte
const supportContext = {
  issue: $json.issue,
  userLevel: $json.userLevel,
  product: $json.product
};

// Quick answers típicos para soporte
const supportQuickAnswers = [
  {
    "id": "issue-details",
    "text": "Proporcionar más detalles",
    "type": "question",
    "category": "support"
  },
  {
    "id": "contact-tech",
    "text": "Contactar técnico",
    "type": "action",
    "category": "support"
  },
  {
    "id": "view-guide",
    "text": "Ver guía de solución",
    "type": "action",
    "category": "support"
  }
];
```

### Para Ventas
```javascript
// Contexto específico para ventas
const salesContext = {
  product: $json.product,
  userInterest: $json.interest,
  stage: $json.salesStage
};

// Quick answers típicos para ventas
const salesQuickAnswers = [
  {
    "id": "product-info",
    "text": "Más información del producto",
    "type": "question",
    "category": "sales"
  },
  {
    "id": "pricing",
    "text": "¿Cuáles son los precios?",
    "type": "question",
    "category": "sales"
  },
  {
    "id": "demo-request",
    "text": "Solicitar demostración",
    "type": "action",
    "category": "sales"
  }
];
```

## Optimizaciones

### 1. Cache de Quick Answers
```javascript
// Evitar regenerar quick answers similares
const cacheKey = `${$json.topic}-${$json.userType}`;
const cached = await getCachedQuickAnswers(cacheKey);

if (cached) {
  return cached;
}
```

### 2. Personalización por Usuario
```javascript
// Adaptar quick answers según el perfil del usuario
const userProfile = $json.userProfile;
const quickAnswers = generatePersonalizedQuickAnswers(userProfile);
```

### 3. A/B Testing
```javascript
// Probar diferentes tipos de quick answers
const variant = getUserVariant($json.userId);
const quickAnswers = generateVariantQuickAnswers(variant);
```

## Monitoreo y Logs

### Logs Importantes
```javascript
// Registrar generación de quick answers
console.log('Quick Answers Generated:', {
  sessionId: $json.sessionId,
  count: $json.quickAnswers.length,
  types: $json.quickAnswers.map(qa => qa.type),
  timestamp: new Date().toISOString()
});
```

### Métricas a Seguir
- Tiempo de generación
- Tasa de uso de quick answers
- Tipos más populares
- Errores de validación

## Troubleshooting

### Error: JSON Inválido
```javascript
// Fallback automático
if (!isValidJSON($json.response)) {
  return getDefaultQuickAnswers();
}
```

### Error: API No Responde
```javascript
// Reintento automático
const maxRetries = 3;
let attempt = 0;

while (attempt < maxRetries) {
  try {
    return await sendQuickAnswers($json);
  } catch (error) {
    attempt++;
    await wait(1000 * attempt); // Backoff exponencial
  }
}
``` 