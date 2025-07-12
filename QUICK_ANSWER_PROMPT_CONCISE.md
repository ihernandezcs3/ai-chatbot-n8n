# Prompt Conciso para Quick Answers (n8n)

## Instrucción Directa

Genera 3-6 sugerencias de preguntas/respuestas rápidas basadas en el contexto de la conversación. Responde ÚNICAMENTE con JSON válido.

## Estructura Requerida

```json
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

## Tipos Disponibles

- `question` (❓) - Preguntas: "¿Cómo puedo...?"
- `answer` (💡) - Respuestas: "Aquí tienes..."
- `confirmation` (✅) - Confirmaciones: "Sí, perfecto"
- `negation` (❌) - Negaciones: "No, gracias"
- `suggestion` (💭) - Sugerencias: "Te sugiero..."
- `action` (⚡) - Acciones: "Ver perfil"
- `help` (🆘) - Ayuda: "Necesito ayuda"

## Reglas

1. **Contexto**: Las opciones deben ser relevantes al tema actual
2. **Variedad**: Usa diferentes tipos
3. **Claridad**: Texto directo y comprensible
4. **IDs únicos**: Identificadores descriptivos

## Ejemplo de Respuesta

```json
{
  "quickAnswers": [
    {
      "id": "help-general",
      "text": "¿Cómo puedo ayudarte?",
      "type": "question",
      "category": "general"
    },
    {
      "id": "support-contact",
      "text": "Contactar soporte",
      "type": "action",
      "category": "support"
    },
    {
      "id": "more-info",
      "text": "Necesito más información",
      "type": "help",
      "category": "general"
    }
  ]
}
```

---

**IMPORTANTE**: Responde SOLO con el JSON. Sin texto adicional. 