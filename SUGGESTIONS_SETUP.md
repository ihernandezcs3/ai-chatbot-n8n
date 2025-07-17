# Suggestions System Setup

## Descripción

El sistema Suggestions permite recibir sugerencias de preguntas y respuestas desde n8n y mostrarlas en el chat como botones clickeables.

## API Endpoints

### POST /api/suggestions
Recibe sugerencias desde n8n y las distribuye a todos los clientes conectados.

**Payload:**
```json
{
  "suggestions": [
    {
      "id": "1",
      "text": "¿Cómo puedo ayudarte?",
      "type": "question",
      "category": "general"
    }
  ],
  "sessionId": "session-123",
  "userId": "user-456"
}
```

### GET /api/suggestions
Endpoint SSE (Server-Sent Events) para recibir sugerencias en tiempo real.

## Estructura de Datos

### Suggestion Object
- `id`: Identificador único (requerido)
- `text`: Texto de la sugerencia (requerido)
- `type`: Tipo de sugerencia (requerido)
- `category`: Categoría opcional para agrupar sugerencias
- `priority`: Prioridad opcional para ordenar sugerencias
- `metadata`: Metadatos adicionales opcionales

### Tipos de Suggestion
- `question`: Preguntas
- `answer`: Respuestas
- `confirmation`: Confirmaciones
- `negation`: Negaciones
- `suggestion`: Sugerencias generales
- `action`: Acciones
- `help`: Ayuda

## Integración con n8n

### Configuración del HTTP Request
- **Método**: POST
- **URL**: `https://tu-dominio.com/api/suggestions`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "suggestions": [
    {
      "id": "1",
      "text": "¿Cómo puedo ayudarte?",
      "type": "question",
      "category": "general"
    }
  ]
}
```

### Flujo de Trabajo
Trigger → Process Data → HTTP Request (Suggestions API) → Success/Error

## Ejemplos de Uso

### Sugerencias de Soporte
```json
{
  "suggestions": [
    {
      "id": "support-1",
      "text": "Necesito ayuda técnica",
      "type": "suggestion",
      "category": "support"
    },
    {
      "id": "support-2",
      "text": "¿Cómo reportar un problema?",
      "type": "question",
      "category": "support"
    }
  ]
}
```

### Sugerencias de Ventas
```json
{
  "suggestions": [
    {
      "id": "sales-1",
      "text": "Quiero ver los precios",
      "type": "suggestion",
      "category": "sales"
    },
    {
      "id": "sales-2",
      "text": "¿Tienen descuentos?",
      "type": "question",
      "category": "sales"
    }
  ]
}
```

### Confirmaciones
```json
{
  "suggestions": [
    {
      "id": "confirm-1",
      "text": "Sí, por favor",
      "type": "confirmation",
      "category": "general"
    },
    {
      "id": "confirm-2",
      "text": "No, gracias",
      "type": "negation",
      "category": "general"
    }
  ]
}
```

## Respuestas de la API

### Éxito
```json
{
  "success": true,
  "message": "Suggestions received and broadcasted successfully",
  "receivedCount": 3
}
```

### Error
```json
{
  "success": false,
  "message": "Invalid payload: suggestions array is required"
}
``` 