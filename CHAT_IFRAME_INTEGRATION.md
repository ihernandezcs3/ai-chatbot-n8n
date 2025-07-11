# 🚀 Integración de Chat IA como Iframe Controlable

Este documento explica cómo integrar el chat de IA como un iframe controlable en otras aplicaciones.

## 📋 Características Principales

- ✅ **Apertura/cierre controlado** desde la aplicación padre
- ✅ **Expansión/minimización** de la ventana
- ✅ **Control de ancho** dinámico
- ✅ **Comunicación bidireccional** entre padre e iframe
- ✅ **Atajos de teclado** (F1 para abrir/cerrar)
- ✅ **Notificaciones** de eventos del chat

## 🎯 Casos de Uso

- **Aplicaciones web** que necesitan un chat de IA integrado
- **Dashboards** con asistente virtual
- **Sitios de e-commerce** con soporte automatizado
- **Aplicaciones empresariales** con asistente interno

## 🔧 Implementación

### 1. Incluir el iframe en tu aplicación

```html
<div id="chatContainer" style="display: none;">
  <iframe 
    src="https://tu-dominio.com" 
    id="chatIframe"
    title="Chat IA"
    style="width: 100%; height: 100%; border: none;"
  ></iframe>
</div>
```

### 2. Controles básicos

```javascript
// Abrir el chat
function openChat() {
  document.getElementById('chatContainer').style.display = 'block';
  chatIframe.contentWindow.postMessage({
    type: 'toggleDrawer',
    isOpen: true
  }, '*');
}

// Cerrar el chat
function closeChat() {
  document.getElementById('chatContainer').style.display = 'none';
  chatIframe.contentWindow.postMessage({
    type: 'toggleDrawer',
    isOpen: false
  }, '*');
}

// Expandir el chat
function expandChat() {
  chatIframe.contentWindow.postMessage({
    type: 'toggleExpand',
    isOpen: true
  }, '*');
}

// Cambiar ancho
function setChatWidth(width) {
  chatIframe.contentWindow.postMessage({
    type: 'iframeWidth',
    width: width
  }, '*');
}
```

### 3. Escuchar eventos del chat

```javascript
window.addEventListener('message', function(event) {
  // Verificar origen por seguridad
  if (event.origin !== 'https://tu-dominio.com') return;
  
  switch(event.data.type) {
    case 'drawerToggle':
      // El chat se abrió o cerró
      console.log('Chat estado:', event.data.isOpen);
      break;
      
    case 'expandToggle':
      // El chat se expandió o minimizó
      console.log('Chat expandido:', event.data.isOpen);
      break;
      
    case 'SESSION_STARTED':
      // Se inició una nueva sesión
      console.log('Sesión:', event.data.data.sessionId);
      break;
      
    case 'RESPONSE_RECEIVED':
      // Se recibió una respuesta del IA
      console.log('Respuesta recibida');
      break;
      
    case 'ERROR':
      // Ocurrió un error
      console.error('Error:', event.data.data.error);
      break;
  }
});
```

## 🎮 Tipos de Mensajes

### Mensajes enviados al iframe:

| Tipo | Descripción | Parámetros |
|------|-------------|------------|
| `toggleDrawer` | Abrir/cerrar el chat | `isOpen: boolean` |
| `toggleExpand` | Expandir/minimizar | `isOpen: boolean` |
| `iframeWidth` | Cambiar ancho | `width: number` |

### Mensajes recibidos del iframe:

| Tipo | Descripción | Datos |
|------|-------------|-------|
| `drawerToggle` | Estado de apertura/cierre | `isOpen: boolean` |
| `expandToggle` | Estado de expansión | `isOpen: boolean` |
| `SESSION_STARTED` | Nueva sesión iniciada | `sessionId: string` |
| `RESPONSE_RECEIVED` | Respuesta del IA recibida | `hasComponents, isMarkdown, responseLength` |
| `ERROR` | Error ocurrido | `error: string` |

## ⌨️ Atajos de Teclado

- **F1**: Abrir/cerrar el chat (desde dentro del iframe)
- **Escape**: Cerrar el chat (desde la aplicación padre)

## 🎨 Personalización

### Estilos CSS recomendados

```css
.chat-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: none;
}

.chat-container.active {
  display: block;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Configuración responsive

```javascript
// Ajustar ancho según el dispositivo
function setResponsiveWidth() {
  const width = window.innerWidth < 768 ? 350 : 600;
  setChatWidth(width);
}

window.addEventListener('resize', setResponsiveWidth);
```

## 🔒 Seguridad

### Verificación de origen

```javascript
window.addEventListener('message', function(event) {
  // Siempre verificar el origen
  const allowedOrigins = [
    'https://tu-dominio.com',
    'http://localhost:3000' // Para desarrollo
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    console.warn('Mensaje de origen no autorizado:', event.origin);
    return;
  }
  
  // Procesar mensaje...
});
```

### Configuración de CSP

```html
<meta http-equiv="Content-Security-Policy" 
      content="frame-src 'self' https://tu-dominio.com;">
```

## 📱 Ejemplo Completo

Ver el archivo `chat-iframe-example.html` para un ejemplo completo y funcional.

## 🚀 Despliegue

1. **Desplegar el chat** en tu servidor
2. **Actualizar la URL** del iframe en tu aplicación
3. **Configurar CORS** si es necesario
4. **Probar la comunicación** entre padre e iframe

## 🐛 Solución de Problemas

### El chat no se abre
- Verificar que la URL del iframe sea correcta
- Revisar la consola del navegador por errores
- Confirmar que el mensaje se envía correctamente

### No se reciben mensajes
- Verificar la configuración de CORS
- Confirmar que el origen está en la lista de permitidos
- Revisar que el iframe esté cargado completamente

### Problemas de estilo
- Verificar que los estilos CSS no entren en conflicto
- Asegurar que el z-index sea apropiado
- Confirmar que el contenedor tenga las dimensiones correctas

## 📞 Soporte

Para problemas o preguntas sobre la integración, revisa:
- Los logs de la consola del navegador
- La documentación de postMessage
- Los ejemplos incluidos en este proyecto 