# n8n Chat Integration - Implementaciones Simples

Este proyecto incluye múltiples implementaciones del chat de n8n usando el paquete `@n8n/chat`, todas diseñadas para ser lo más simples posible y fáciles de integrar.

## 🚀 Implementaciones Disponibles

### 1. **Página Next.js** (`/n8n-chat`)
- **Ruta:** `http://localhost:3000/n8n-chat`
- **Archivos:** `app/n8n-chat/page.tsx` y `app/n8n-chat/N8nChatComponent.tsx`
- **Uso:** Integración dentro de la aplicación Next.js existente

### 2. **HTML Standalone** (`/n8n-chat-simple.html`)
- **Ruta:** `http://localhost:3000/n8n-chat-simple.html`
- **Archivo:** `public/n8n-chat-simple.html`
- **Uso:** Página HTML completa que se puede abrir directamente

### 3. **Widget Minimalista** (`/n8n-chat-widget.html`)
- **Ruta:** `http://localhost:3000/n8n-chat-widget.html`
- **Archivo:** `public/n8n-chat-widget.html`
- **Uso:** Widget que se puede insertar en cualquier página web

## 🔧 Configuración

Todas las implementaciones usan la misma configuración:

```javascript
{
  webhookUrl: 'http://localhost:5678/webhook/dc79ba63-5b70-4d3d-a4eb-b77c2a01c8d7/chat',
  target: '#n8n-chat-container',
  mode: 'fullscreen',
  showWelcomeScreen: true,
  initialMessages: [
    'Hi there! 👋',
    'I\'m your AI assistant. How can I help you today?'
  ],
  i18n: {
    en: {
      title: 'AI Chat Assistant',
      subtitle: 'Ask me anything!',
      footer: '',
      getStarted: 'New Conversation',
      inputPlaceholder: 'Type your question...',
    },
  },
}
```

## 📦 Integración en Otras Plataformas

### Opción 1: HTML Simple
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sitio Web</title>
    <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
</head>
<body>
    <h1>Mi Sitio Web</h1>
    
    <!-- Insertar el chat -->
    <div id="n8n-chat-widget" style="width: 400px; height: 500px;"></div>
    
    <script type="module">
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        
        createChat({
            webhookUrl: 'http://localhost:5678/webhook/dc79ba63-5b70-4d3d-a4eb-b77c2a01c8d7/chat',
            target: '#n8n-chat-widget',
            mode: 'fullscreen',
            showWelcomeScreen: true,
            initialMessages: [
                'Hi there! 👋',
                'How can I help you today?'
            ]
        });
    </script>
</body>
</html>
```

### Opción 2: Iframe Embed
```html
<iframe 
    src="http://localhost:3000/n8n-chat-widget.html" 
    width="400" 
    height="500" 
    frameborder="0"
    style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
</iframe>
```

### Opción 3: JavaScript Dinámico
```javascript
// Función para cargar el chat en cualquier elemento
function loadN8nChat(containerId, webhookUrl) {
    const container = document.getElementById(containerId);
    
    // Load CSS
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Load script
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        
        createChat({
            webhookUrl: '${webhookUrl}',
            target: '#${containerId}',
            mode: 'fullscreen',
            showWelcomeScreen: true,
            initialMessages: [
                'Hi there! 👋',
                'How can I help you today?'
            ]
        });
    `;
    
    document.head.appendChild(script);
}

// Uso
loadN8nChat(
    'my-chat-container', 
    'http://localhost:5678/webhook/dc79ba63-5b70-4d3d-a4eb-b77c2a01c8d7/chat'
);
```

## 🎨 Personalización

### Cambiar Modo de Visualización
```javascript
mode: 'window',      // Modo ventana (botón flotante)
mode: 'fullscreen'   // Modo pantalla completa
```

### Cambiar Mensajes
```javascript
initialMessages: [
    'Tu mensaje de bienvenida 1',
    'Tu mensaje de bienvenida 2'
],
i18n: {
    en: {
        title: 'Tu título',
        subtitle: 'Tu subtítulo',
        inputPlaceholder: 'Tu placeholder...',
    },
}
```

### Configuración Avanzada
```javascript
{
    webhookUrl: 'your-webhook-url',
    target: '#your-container',
    mode: 'fullscreen',
    showWelcomeScreen: true,
    loadPreviousSession: true,
    chatInputKey: 'chatInput',
    chatSessionKey: 'sessionId',
    allowFileUploads: false,
    allowedFilesMimeTypes: 'image/*,application/pdf',
    initialMessages: [
        'Hi there! 👋',
        'How can I help you today?'
    ],
    i18n: {
        en: {
            title: 'AI Chat Assistant',
            subtitle: 'Ask me anything!',
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question...',
        },
    },
}
```

## 🎨 Personalización CSS

El chat es completamente personalizable usando CSS variables:

```css
:root {
    --chat--color-primary: #2563eb;
    --chat--color-secondary: #20b69e;
    --chat--color-white: #ffffff;
    --chat--color-light: #f2f4f8;
    --chat--color-dark: #101330;
    
    --chat--window--width: 400px;
    --chat--window--height: 600px;
    
    --chat--border-radius: 0.25rem;
    --chat--transition-duration: 0.15s;
}
```

## 🔒 Seguridad

- **CORS:** Configura los headers CORS apropiados en tu servidor n8n
- **HTTPS:** Usa HTTPS en producción para las comunicaciones seguras
- **Allowed Origins:** Añade tu dominio a los "Allowed Origins" en el nodo Chat Trigger de n8n

## 🚨 Notas Importantes

1. **CDN Correcto:** Usa `https://cdn.jsdelivr.net/npm/@n8n/chat/dist/` en lugar de unpkg
2. **ES Modules:** El paquete requiere `type="module"` en el script
3. **CSS Requerido:** Siempre incluye el archivo CSS del paquete
4. **Compatibilidad:** Funciona en navegadores modernos que soporten ES modules
5. **Mantenimiento:** El chat actual sigue funcionando sin cambios

## 🔗 Enlaces Útiles

- [Documentación oficial de @n8n/chat](https://www.npmjs.com/package/@n8n/chat)
- [Chat actual del proyecto](../app/components/ChatInterface.tsx)
- [API del chat](../app/api/chat/route.ts) 