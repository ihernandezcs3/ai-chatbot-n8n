# Sistema de Componentes Dinámicos para n8n

Este sistema permite que tu workflow de n8n devuelva componentes UI dinámicos y contenido Markdown en lugar de solo texto plano.

## Cómo funciona

1. **n8n devuelve JSON estructurado** con información de componentes o Markdown
2. **El frontend renderiza automáticamente** los componentes basado en el JSON
3. **Soporte para Markdown** con detección automática y renderizado
4. **Soporte para componentes anidados** y múltiples componentes por respuesta

## Formato de Respuesta desde n8n

### Respuesta con texto simple (comportamiento actual)
```json
{
  "output": "Hola, ¿cómo estás?"
}
```

### Respuesta con Markdown
```json
{
  "output": "# Título Principal\n\nEste es un **texto en negrita** y *texto en cursiva*.\n\n## Lista de elementos\n- Item 1\n- Item 2\n- Item 3\n\n```javascript\nconsole.log('Hola mundo');\n```"
}
```

### Respuesta con componentes dinámicos
```json
{
  "components": [
    {
      "type": "text",
      "content": "Aquí tienes la información que solicitaste:"
    },
    {
      "type": "card",
      "title": "Información del Usuario",
      "content": "Datos importantes sobre el usuario",
      "children": [
        {
          "type": "badge",
          "text": "Activo",
          "variant": "success"
        },
        {
          "type": "button",
          "label": "Ver Detalles",
          "action": "view_details",
          "variant": "primary"
        }
      ]
    }
  ]
}
```

## Soporte para Markdown

El sistema detecta automáticamente cuando una respuesta contiene Markdown y la renderiza apropiadamente.

### Elementos Markdown Soportados

#### Headers
```markdown
# Título H1
## Título H2
### Título H3
#### Título H4
```

#### Formato de Texto
```markdown
**Texto en negrita**
*Texto en cursiva*
~~Texto tachado~~
`código inline`
```

#### Enlaces
```markdown
[Texto del enlace](https://ejemplo.com)
```

#### Listas
```markdown
- Item de lista no ordenada
- Otro item
  - Subitem

1. Item de lista ordenada
2. Segundo item
```

#### Bloques de Código
```markdown
```javascript
function saludar() {
  console.log('Hola mundo');
}
```
```

#### Tablas
```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |
```

#### Citas
```markdown
> Esta es una cita importante
> que puede tener múltiples líneas
```

#### Listas de Tareas
```markdown
- [x] Tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea
```

### Ejemplo Completo de Markdown desde n8n

```json
{
  "output": "# Reporte de Usuario\n\n## Información Personal\n- **Nombre:** Juan Pérez\n- **Email:** juan@ejemplo.com\n- **Estado:** Activo\n\n## Estadísticas\n| Métrica | Valor |\n|---------|-------|\n| Mensajes | 150 |\n| Archivos | 25 |\n\n## Código de Ejemplo\n```javascript\nconst usuario = {\n  nombre: 'Juan',\n  edad: 30\n};\nconsole.log(usuario);\n```\n\n> **Nota:** Este es un reporte generado automáticamente.\n\n### Próximos Pasos\n1. Revisar datos\n2. [Ver documentación](https://docs.ejemplo.com)\n3. Contactar soporte si es necesario"
}
```

## Componentes Disponibles

### 1. Text (`text`)
Texto simple con estilos personalizables.
```json
{
  "type": "text",
  "content": "Este es un texto simple",
  "props": {
    "className": "text-lg font-bold"
  }
}
```

### 2. Heading (`heading`)
Títulos con diferentes niveles (h1-h6).
```json
{
  "type": "heading",
  "props": {
    "level": 2,
    "content": "Título Principal",
    "className": "text-blue-600"
  }
}
```

### 3. Button (`button`)
Botones con diferentes variantes y acciones.
```json
{
  "type": "button",
  "props": {
    "label": "Descargar Archivo",
    "action": "https://example.com/download",
    "variant": "primary"
  }
}
```

**Variantes disponibles:**
- `primary` (azul)
- `secondary` (gris)
- `outline` (borde)

### 4. Link (`link`)
Enlaces externos con icono.
```json
{
  "type": "link",
  "props": {
    "url": "https://example.com",
    "text": "Visitar sitio web"
  }
}
```

### 5. Image (`image`)
Imágenes con controles de tamaño.
```json
{
  "type": "image",
  "props": {
    "src": "https://example.com/image.jpg",
    "alt": "Descripción de la imagen",
    "width": 300,
    "height": 200
  }
}
```

### 6. Card (`card`)
Contenedores con título, contenido y componentes hijos.
```json
{
  "type": "card",
  "props": {
    "title": "Título de la Tarjeta",
    "content": "Contenido descriptivo"
  },
  "children": [
    {
      "type": "text",
      "content": "Contenido adicional"
    }
  ]
}
```

### 7. List (`list`)
Listas ordenadas o no ordenadas.
```json
{
  "type": "list",
  "props": {
    "items": ["Item 1", "Item 2", "Item 3"],
    "type": "ul"
  }
}
```

### 8. Badge (`badge`)
Etiquetas con diferentes variantes de color.
```json
{
  "type": "badge",
  "props": {
    "text": "Nuevo",
    "variant": "success"
  }
}
```

**Variantes disponibles:**
- `default` (gris)
- `success` (verde)
- `warning` (amarillo)
- `error` (rojo)
- `info` (azul)

### 9. Code (`code`)
Bloques de código con sintaxis highlighting.
```json
{
  "type": "code",
  "props": {
    "content": "console.log('Hello World');",
    "language": "javascript"
  }
}
```

### 10. Table (`table`)
Tablas con encabezados y filas.
```json
{
  "type": "table",
  "props": {
    "headers": ["Nombre", "Edad", "Ciudad"],
    "rows": [
      ["Juan", "25", "Madrid"],
      ["María", "30", "Barcelona"]
    ]
  }
}
```

### 11. Divider (`divider`)
Líneas divisorias.
```json
{
  "type": "divider"
}
```

## Ejemplos Complejos

### Dashboard con Múltiples Componentes
```json
{
  "components": [
    {
      "type": "heading",
      "props": {
        "level": 1,
        "content": "Dashboard de Usuario"
      }
    },
    {
      "type": "card",
      "props": {
        "title": "Estadísticas",
        "content": "Resumen de actividad reciente"
      },
      "children": [
        {
          "type": "table",
          "props": {
            "headers": ["Métrica", "Valor", "Estado"],
            "rows": [
              ["Mensajes", "150", "Activo"],
              ["Archivos", "25", "Completado"]
            ]
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "button",
          "props": {
            "label": "Ver Reporte Completo",
            "action": "https://example.com/report",
            "variant": "primary"
          }
        }
      ]
    }
  ]
}
```

### Formulario Interactivo
```json
{
  "components": [
    {
      "type": "text",
      "content": "Por favor, selecciona una opción:"
    },
    {
      "type": "card",
      "children": [
        {
          "type": "button",
          "props": {
            "label": "Opción 1",
            "action": "select_option_1",
            "variant": "outline"
          }
        },
        {
          "type": "button",
          "props": {
            "label": "Opción 2",
            "action": "select_option_2",
            "variant": "outline"
          }
        }
      ]
    }
  ]
}
```

## Implementación en n8n

### 1. Configura tu workflow de n8n
- Asegúrate de que el nodo final devuelva JSON válido
- Usa el formato `{ "components": [...] }` para componentes dinámicos
- Usa el formato `{ "output": "texto" }` para texto simple o Markdown

### 2. Ejemplo de nodo Function en n8n para Markdown
```javascript
// Para devolver contenido Markdown
const userInput = $input.first().json.chatInput;

if (userInput.includes('reporte')) {
  return {
    output: `# Reporte Generado\n\n## Resumen\n- **Total de registros:** 1,234\n- **Fecha:** ${new Date().toLocaleDateString()}\n\n## Detalles\n| Campo | Valor |\n|-------|-------|\n| Usuarios | 567 |\n| Archivos | 89 |\n\n> Este reporte fue generado automáticamente.\n\n### Próximos pasos\n1. Revisar datos\n2. [Ver documentación](https://docs.ejemplo.com)`
  };
}

return {
  output: "¿En qué puedo ayudarte? Puedes pedirme un reporte o información específica."
};
```

### 3. Ejemplo de nodo Function para componentes dinámicos
```javascript
// Para devolver componentes dinámicos
return {
  components: [
    {
      type: "card",
      props: {
        title: "Información",
        content: "Datos procesados correctamente"
      },
      children: [
        {
          type: "badge",
          text: "Completado",
          variant: "success"
        }
      ]
    }
  ]
};
```

### 4. Ejemplo de nodo HTTP Response en n8n
```json
{
  "output": "# {{ $json.title }}\n\n{{ $json.content }}\n\n## Enlaces\n- [Documentación]({{ $json.docsUrl }})\n- [Soporte]({{ $json.supportUrl }})"
}
```

## Personalización

### Agregar Nuevos Componentes
1. Edita `app/components/DynamicComponentRenderer.tsx`
2. Agrega tu componente al `componentRegistry`
3. Define la interfaz TypeScript correspondiente

### Estilos Personalizados
- Usa la prop `className` para aplicar estilos CSS personalizados
- Los componentes usan Tailwind CSS por defecto
- Puedes combinar clases de Tailwind con CSS personalizado

### Personalizar Markdown
- Edita `app/components/MarkdownRenderer.tsx` para cambiar estilos
- Modifica los componentes personalizados en el objeto `components`
- Agrega soporte para plugins adicionales de remark

## Ventajas del Sistema

1. **Flexibilidad**: Renderiza cualquier tipo de UI desde n8n
2. **Markdown Nativo**: Soporte completo para formato Markdown
3. **Reutilización**: Componentes consistentes en toda la aplicación
4. **Mantenibilidad**: Fácil de actualizar y extender
5. **Interactividad**: Botones, enlaces y acciones dinámicas
6. **Responsive**: Componentes adaptables a diferentes tamaños de pantalla
7. **Detección Automática**: El sistema detecta automáticamente el tipo de contenido 