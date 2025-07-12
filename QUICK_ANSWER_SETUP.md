# QuickAnswer System Setup

## Descripción
El sistema QuickAnswer permite recibir sugerencias de preguntas y respuestas desde n8n y mostrarlas en el chat como botones clickeables.

## Estructura de Datos

### Endpoint API
- **URL**: `POST /api/quickanswer`
- **Método**: POST
- **Content-Type**: `application/json`

### Payload Structure
```json
{
  "quickAnswers": [
    {
      "id": "unique-id-1",
      "text": "¿Cómo puedo ayudarte?",
      "type": "question",
      "category": "general",
      "priority": 1,
      "metadata": {
        "context": "welcome"
      }
    },
    {
      "id": "unique-id-2", 
      "text": "Sí, estoy de acuerdo",
      "type": "confirmation",
      "category": "responses"
    }
  ],
  "sessionId": "optional-session-id",
  "userId": "optional-user-id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Tipos de QuickAnswer
- `question` - Preguntas (azul)
- `answer` - Respuestas (verde) 
- `confirmation` - Confirmaciones (esmeralda)
- `negation` - Negaciones (rojo)
- `suggestion` - Sugerencias (púrpura)
- `action` - Acciones (naranja)
- `help` - Ayuda (amarillo)

### Campos Requeridos
- `id`: Identificador único (string)
- `text`: Texto a mostrar (string)
- `type`: Tipo de quick answer (QuickAnswerType)

### Campos Opcionales
- `category`: Categoría para agrupar (string)
- `priority`: Prioridad de ordenamiento (number)
- `metadata`: Datos adicionales (object)

## Configuración en n8n

### 1. Crear Webhook Node
```javascript
// En n8n, crear un HTTP Request node
{
  "method": "POST",
  "url": "https://tu-dominio.com/api/quickanswer",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "quickAnswers": [
      {
        "id": "qa-1",
        "text": "¿Cuál es el estado de mi pedido?",
        "type": "question",
        "category": "orders"
      },
      {
        "id": "qa-2", 
        "text": "Necesito ayuda técnica",
        "type": "help",
        "category": "support"
      }
    ]
  }
}
```

### 2. Ejemplo de Flujo n8n
```
Trigger → Process Data → HTTP Request (QuickAnswer API) → Success/Error
```

### 3. Respuesta del API
```json
{
  "success": true,
  "message": "Quick answers received and broadcasted successfully",
  "receivedCount": 2
}
```

## Funcionalidades del Frontend

### Conexión Automática
- El frontend se conecta automáticamente al endpoint SSE
- Reintenta conexión cada 5 segundos si se pierde
- Muestra estado de conexión (conectado/conectando/error)

### Visualización
- Grid responsive de botones
- Colores por tipo de quick answer
- Iconos distintivos por tipo
- Tooltips con información adicional

### Interacción
- Click en botón envía el texto como mensaje
- Animaciones hover y click
- Truncado de texto largo

## Ejemplos de Uso

### Preguntas Frecuentes
```json
{
  "quickAnswers": [
    {
      "id": "faq-1",
      "text": "¿Cuáles son los horarios de atención?",
      "type": "question",
      "category": "faq"
    },
    {
      "id": "faq-2", 
      "text": "¿Cómo puedo cambiar mi contraseña?",
      "type": "question",
      "category": "faq"
    }
  ]
}
```

### Respuestas Rápidas
```json
{
  "quickAnswers": [
    {
      "id": "resp-1",
      "text": "Perfecto, procedo con eso",
      "type": "confirmation",
      "category": "responses"
    },
    {
      "id": "resp-2",
      "text": "No, necesito más información",
      "type": "negation", 
      "category": "responses"
    }
  ]
}
```

### Sugerencias Contextuales
```json
{
  "quickAnswers": [
    {
      "id": "sug-1",
      "text": "Ver mi perfil",
      "type": "action",
      "category": "profile"
    },
    {
      "id": "sug-2",
      "text": "Contactar soporte",
      "type": "help",
      "category": "support"
    }
  ]
}
```

## Notas Técnicas

### Server-Sent Events (SSE)
- Conexión persistente para recibir actualizaciones en tiempo real
- Reconexión automática en caso de error
- Broadcast a todos los clientes conectados

### Rendimiento
- Los quick answers se almacenan en memoria del servidor
- Limpieza automática de clientes desconectados
- Validación de datos en el servidor

### Seguridad
- Validación de estructura de datos
- Sanitización de entrada
- Headers CORS configurados

## Troubleshooting

### Error de Conexión
- Verificar que el endpoint esté accesible
- Revisar logs del servidor
- Comprobar configuración CORS

### Quick Answers No Aparecen
- Verificar estructura del payload
- Comprobar que todos los campos requeridos estén presentes
- Revisar logs del navegador para errores SSE

### Problemas de Rendimiento
- Limitar número de quick answers (máximo 10-15 recomendado)
- Usar categorías para organizar
- Implementar prioridades para ordenamiento 