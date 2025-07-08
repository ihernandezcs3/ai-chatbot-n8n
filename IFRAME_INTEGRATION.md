# Integración del Chat como Iframe

Este documento explica cómo integrar la aplicación de chat como un iframe en la aplicación padre (Siaffe).

## Configuración del Iframe

### 1. Crear el iframe en la aplicación padre

```html
<iframe 
  id="chat-iframe"
  src="https://tu-dominio-chat.com" 
  width="100%" 
  height="600px"
  frameborder="0"
  allow="microphone; camera"
></iframe>
```

### 2. Enviar datos al iframe

Una vez que el iframe esté cargado, puedes enviar los datos necesarios:

```javascript
// Función para enviar datos al iframe
function sendDataToChat(data) {
  const iframe = document.getElementById('chat-iframe');
  
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'INIT_DATA',
      data: {
        CliCod: 20115,        // Código del cliente
        PrdCod: 4,           // Código del producto
        Email: "usuario@ejemplo.com",
        userName: "Nombre del Usuario"  // Opcional
      }
    }, '*');
  }
}

// Ejemplo de uso
sendDataToChat({
  CliCod: 20115,
  PrdCod: 4,
  Email: "usuario@ejemplo.com",
  userName: "Juan Pérez"
});
```

### 3. Escuchar mensajes del iframe

```javascript
// Función para manejar mensajes del iframe
function handleChatMessage(event) {
  // Verificar que el mensaje viene del iframe
  if (event.source !== document.getElementById('chat-iframe').contentWindow) {
    return;
  }

  const message = event.data;
  
  switch (message.type) {
    case 'SESSION_STARTED':
      console.log('Chat iniciado:', message.data);
      break;
      
    case 'MESSAGE_SENT':
      console.log('Mensaje enviado:', message.data);
      break;
      
    case 'RESPONSE_RECEIVED':
      console.log('Respuesta recibida:', message.data);
      break;
      
    case 'ERROR':
      console.error('Error en el chat:', message.data);
      break;
      
    default:
      console.log('Mensaje no reconocido:', message);
  }
}

// Agregar listener para mensajes del iframe
window.addEventListener('message', handleChatMessage);
```

## Tipos de Mensajes

### Mensajes enviados al iframe (desde el padre)

| Tipo | Descripción | Datos |
|------|-------------|-------|
| `INIT_DATA` | Inicializar datos del usuario | `{ CliCod, PrdCod, Email, userName? }` |
| `UPDATE_DATA` | Actualizar datos del usuario | `{ CliCod, PrdCod, Email, userName? }` |
| `RESET_SESSION` | Resetear la sesión del chat | Sin datos |

### Mensajes recibidos del iframe (hacia el padre)

| Tipo | Descripción | Datos |
|------|-------------|-------|
| `SESSION_STARTED` | Sesión iniciada | `{ sessionId, parentData }` |
| `MESSAGE_SENT` | Mensaje enviado por el usuario | `{ sessionId, messageLength }` |
| `RESPONSE_RECEIVED` | Respuesta recibida del agente | `{ sessionId, hasComponents, isMarkdown, responseLength }` |
| `ERROR` | Error en el chat | `{ sessionId, error }` |

## Ejemplo Completo de Integración

```html
<!DOCTYPE html>
<html>
<head>
    <title>Aplicación Padre</title>
</head>
<body>
    <h1>Mi Aplicación</h1>
    
    <!-- Contenedor del chat -->
    <div id="chat-container">
        <iframe 
            id="chat-iframe"
            src="https://tu-dominio-chat.com" 
            width="100%" 
            height="600px"
            frameborder="0"
        ></iframe>
    </div>

    <script>
        // Variables globales
        let chatIframe = null;
        
        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            chatIframe = document.getElementById('chat-iframe');
            
            // Esperar a que el iframe esté listo
            chatIframe.addEventListener('load', function() {
                // Enviar datos después de un pequeño delay para asegurar que el iframe esté listo
                setTimeout(() => {
                    sendDataToChat({
                        CliCod: 20115,
                        PrdCod: 4,
                        Email: "usuario@ejemplo.com",
                        userName: "Juan Pérez"
                    });
                }, 1000);
            });
        });
        
        // Función para enviar datos al chat
        function sendDataToChat(data) {
            if (chatIframe && chatIframe.contentWindow) {
                chatIframe.contentWindow.postMessage({
                    type: 'INIT_DATA',
                    data: data
                }, '*');
                console.log('Datos enviados al chat:', data);
            }
        }
        
        // Función para actualizar datos
        function updateChatData(data) {
            if (chatIframe && chatIframe.contentWindow) {
                chatIframe.contentWindow.postMessage({
                    type: 'UPDATE_DATA',
                    data: data
                }, '*');
            }
        }
        
        // Función para resetear la sesión
        function resetChatSession() {
            if (chatIframe && chatIframe.contentWindow) {
                chatIframe.contentWindow.postMessage({
                    type: 'RESET_SESSION'
                }, '*');
            }
        }
        
        // Manejar mensajes del iframe
        window.addEventListener('message', function(event) {
            // Verificar origen del mensaje
            if (event.source !== chatIframe?.contentWindow) {
                return;
            }
            
            const message = event.data;
            console.log('Mensaje recibido del chat:', message);
            
            switch (message.type) {
                case 'SESSION_STARTED':
                    console.log('Chat iniciado con sesión:', message.data.sessionId);
                    break;
                    
                case 'MESSAGE_SENT':
                    console.log('Usuario envió mensaje de', message.data.messageLength, 'caracteres');
                    break;
                    
                case 'RESPONSE_RECEIVED':
                    console.log('Agente respondió:', message.data);
                    break;
                    
                case 'ERROR':
                    console.error('Error en el chat:', message.data.error);
                    // Aquí puedes mostrar una notificación al usuario
                    break;
            }
        });
        
        // Ejemplo: Botones para controlar el chat
        function addChatControls() {
            const controls = document.createElement('div');
            controls.innerHTML = `
                <button onclick="updateChatData({CliCod: 20116, PrdCod: 5, Email: 'nuevo@ejemplo.com', userName: 'Nuevo Usuario'})">
                    Cambiar Usuario
                </button>
                <button onclick="resetChatSession()">
                    Resetear Sesión
                </button>
            `;
            document.body.appendChild(controls);
        }
        
        // Agregar controles después de que el iframe esté listo
        chatIframe.addEventListener('load', addChatControls);
    </script>
</body>
</html>
```

## Consideraciones de Seguridad

1. **Origen del mensaje**: Siempre verifica que el mensaje viene del iframe esperado
2. **Validación de datos**: Valida los datos recibidos antes de procesarlos
3. **HTTPS**: Usa HTTPS tanto en la aplicación padre como en el iframe
4. **CORS**: Configura correctamente los headers CORS si es necesario

## Troubleshooting

### El chat no recibe los datos
- Verifica que el iframe esté completamente cargado antes de enviar datos
- Revisa la consola del navegador para errores
- Asegúrate de que la URL del iframe sea correcta

### Los mensajes no se envían
- Verifica que el `postMessage` se esté ejecutando
- Revisa que el origen del mensaje sea correcto
- Asegúrate de que el iframe esté en el mismo dominio o configurado correctamente

### El chat no responde
- Verifica que los datos enviados tengan el formato correcto
- Revisa la consola del iframe para errores
- Asegúrate de que la API del chat esté funcionando 