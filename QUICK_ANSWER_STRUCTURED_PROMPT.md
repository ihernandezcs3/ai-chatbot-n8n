# Prompt para Structured Output Parser (n8n)

## Instrucción Principal

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

## Ejemplos de Respuestas Válidas

### Ejemplo 1: Soporte Técnico
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
  ]
}
```

### Ejemplo 2: Consulta de Productos
```json
{
  "quickAnswers": [
    {
      "id": "product-info",
      "text": "Más información del producto",
      "type": "question",
      "category": "products"
    },
    {
      "id": "product-pricing",
      "text": "¿Cuáles son los precios?",
      "type": "question",
      "category": "products"
    },
    {
      "id": "product-demo",
      "text": "Solicitar demostración",
      "type": "action",
      "category": "products"
    },
    {
      "id": "product-support",
      "text": "Ayuda con productos",
      "type": "help",
      "category": "support"
    }
  ]
}
```

## Instrucciones Finales

1. **ANALIZA** el contexto proporcionado
2. **IDENTIFICA** las necesidades más probables del usuario
3. **GENERA** quick answers relevantes y útiles
4. **DIVERSIFICA** los tipos de quick answers
5. **MANTÉN** el texto claro y conciso
6. **USA** IDs descriptivos y únicos

## Notas Importantes

- **Solo JSON válido**: No incluyas explicaciones fuera del JSON
- **Estructura exacta**: Sigue el schema proporcionado
- **Contexto relevante**: Las opciones deben ser útiles para el usuario actual
- **Variedad de tipos**: No uses solo un tipo de quick answer
- **Longitud apropiada**: Los textos deben ser legibles en botones pequeños

---

**RESPONDE ÚNICAMENTE CON EL JSON VÁLIDO SEGÚN EL SCHEMA PROPORCIONADO.** 