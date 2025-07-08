# Integración de Metadata con n8n Chat

Este documento explica cómo enviar información adicional (metadata) desde tu plataforma al chat de n8n.

## 🎯 ¿Qué es Metadata?

La metadata es información adicional que se envía junto con cada mensaje del chat. Esto permite que tu workflow de n8n tenga acceso a datos del contexto del usuario, como:

- Código de cliente
- ID de producto
- Email del usuario
- Información de sesión
- Datos de la plataforma

## 📋 Ejemplos de Implementación

### 1. **Demo Completo con Formulario**
- **Archivo:** `public/n8n-chat-widget-simple-metadata.html`
- **Características:** Formulario interactivo para configurar metadata
- **Uso:** Perfecto para testing y demostraciones

### 2. **Implementación Simple**
- **Archivo:** `public/n8n-chat-widget-simple-metadata.html`
- **Características:** Metadata hardcodeada, fácil de modificar
- **Uso:** Para integraciones rápidas

## 🔧 Cómo Implementar Metadata

### Opción 1: Metadata Estática

```javascript
// Metadata que se enviará con cada mensaje
const metadata = {
    clientCode: 12345,
    productId: 789,
    userEmail: 'cliente@ejemplo.com',
    userName: 'Juan Pérez',
    timestamp: new Date().toISOString(),
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`
};

createChat({
    webhookUrl: 'http://localhost:5678/webhook/dc79ba63-5b70-4d3d-a4eb-b77c2a01c8d7/chat',
    target: '#n8n-chat-widget',
    mode: 'fullscreen',
    metadata: metadata, // ¡Aquí está la metadata!
    // ... otras opciones
});
```

### Opción 2: Metadata Dinámica

```javascript
// Función para obtener datos del usuario desde tu plataforma
function getUserData() {
    // Aquí puedes obtener datos de:
    // - URL parameters
    // - LocalStorage
    // - Cookies
    // - API calls
    // - Form inputs
    
    return {
        clientCode: getClientCodeFromURL(),
        productId: getProductFromLocalStorage(),
        userEmail: getEmailFromCookies(),
        userName: getUserNameFromAPI(),
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
    };
}

// Inicializar chat con metadata dinámica
const metadata = getUserData();
createChat({
    webhookUrl: 'your-webhook-url',
    target: '#n8n-chat-widget',
    metadata: metadata
});
```

### Opción 3: Metadata desde URL Parameters

```javascript
// Obtener metadata desde parámetros de URL
function getMetadataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
        clientCode: parseInt(urlParams.get('client') || '0'),
        productId: parseInt(urlParams.get('product') || '0'),
        userEmail: urlParams.get('email') || '',
        userName: urlParams.get('name') || '',
        timestamp: new Date().toISOString(),
        sessionId: urlParams.get('session') || generateSessionId()
    };
}

// Uso: tu-sitio.com/chat?client=12345&product=789&email=cliente@ejemplo.com
```

## 📊 Estructura de Metadata Recomendada

```javascript
const metadata = {
    // Información del cliente
    clientCode: 12345,           // Código numérico del cliente
    productId: 789,              // ID del producto
    userEmail: 'cliente@ejemplo.com',
    userName: 'Juan Pérez',
    
    // Información de sesión
    sessionId: 'session_abc123',
    timestamp: '2024-01-15T10:30:00.000Z',
    
    // Información de la plataforma
    platform: 'web',             // 'web', 'mobile', 'desktop'
    userAgent: navigator.userAgent,
    language: navigator.language,
    
    // Información adicional
    source: 'product-page',      // De dónde viene el usuario
    campaign: 'winter-sale',     // Campaña de marketing
    referrer: document.referrer,
    
    // Datos personalizados
    customData: {
        subscription: 'premium',
        region: 'US',
        preferences: ['email', 'sms']
    }
};
```

## 🔄 Cómo Recibir Metadata en n8n

En tu workflow de n8n, la metadata llegará en el nodo Chat Trigger:

```json
{
  "chatInput": "Hola, necesito ayuda",
  "sessionId": "session_abc123",
  "metadata": {
    "clientCode": 12345,
    "productId": 789,
    "userEmail": "cliente@ejemplo.com",
    "userName": "Juan Pérez",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "sessionId": "session_abc123",
    "platform": "web"
  }
}
```

### Ejemplo de Uso en n8n

```javascript
// En un nodo Function de n8n
const chatInput = $input.first().json.chatInput;
const metadata = $input.first().json.metadata;

// Usar la metadata para personalizar la respuesta
const clientName = metadata.userName;
const productId = metadata.productId;

return {
  json: {
    message: `Hola ${clientName}! Veo que estás interesado en el producto ${productId}. ¿En qué puedo ayudarte?`,
    clientInfo: metadata
  }
};
```

## 🎨 Personalización con Metadata

### Mensajes Iniciales Personalizados

```javascript
createChat({
    // ... otras opciones
    metadata: metadata,
    initialMessages: [
        `Hola ${metadata.userName}! 👋`,
        `Veo que estás interesado en el producto ${metadata.productId}. ¿En qué puedo ayudarte?`
    ],
    i18n: {
        en: {
            title: 'Asistente de Cliente',
            subtitle: `Código: ${metadata.clientCode} | Producto: ${metadata.productId}`,
            footer: `Sesión: ${metadata.sessionId}`,
        },
    },
});
```

### Validación de Metadata

```javascript
function validateMetadata(metadata) {
    const required = ['clientCode', 'userEmail'];
    const missing = required.filter(field => !metadata[field]);
    
    if (missing.length > 0) {
        console.warn('Metadata faltante:', missing);
        return false;
    }
    
    return true;
}

const metadata = getUserData();
if (validateMetadata(metadata)) {
    createChat({
        webhookUrl: 'your-webhook-url',
        metadata: metadata
    });
} else {
    // Mostrar error o usar valores por defecto
    createChat({
        webhookUrl: 'your-webhook-url',
        metadata: { clientCode: 0, userEmail: 'anonymous@example.com' }
    });
}
```

## 🔒 Seguridad y Privacidad

### Datos Sensibles
- **NO incluyas** contraseñas, tokens de acceso, o información financiera
- **SÍ incluye** IDs de referencia, códigos de cliente, información pública

### Validación en el Servidor
```javascript
// En tu workflow de n8n, valida la metadata
const metadata = $input.first().json.metadata;

if (!metadata.clientCode || !metadata.userEmail) {
    throw new Error('Metadata requerida faltante');
}

// Verificar que el cliente existe en tu base de datos
const client = await getClientFromDatabase(metadata.clientCode);
if (!client) {
    throw new Error('Cliente no encontrado');
}
```

## 🚀 Casos de Uso Comunes

### 1. **E-commerce**
```javascript
const metadata = {
    clientCode: getCustomerId(),
    productId: getCurrentProductId(),
    cartValue: getCartTotal(),
    lastPurchase: getLastPurchaseDate(),
    loyaltyLevel: getLoyaltyLevel()
};
```

### 2. **Soporte Técnico**
```javascript
const metadata = {
    clientCode: getClientId(),
    ticketId: getCurrentTicketId(),
    priority: getTicketPriority(),
    category: getTicketCategory(),
    agentId: getAssignedAgent()
};
```

### 3. **Educación**
```javascript
const metadata = {
    studentId: getStudentId(),
    courseId: getCurrentCourseId(),
    progress: getCourseProgress(),
    level: getStudentLevel(),
    preferences: getLearningPreferences()
};
```

## 📱 Integración en Diferentes Plataformas

### WordPress
```php
// En tu tema de WordPress
$client_id = get_current_user_id();
$product_id = get_post_meta(get_the_ID(), 'product_id', true);

echo '<script>
const metadata = {
    clientCode: ' . $client_id . ',
    productId: ' . $product_id . ',
    userEmail: "' . wp_get_current_user()->user_email . '",
    platform: "wordpress"
};
</script>';
```

### Shopify
```liquid
<!-- En tu tema de Shopify -->
<script>
const metadata = {
    clientCode: {{ customer.id }},
    productId: {{ product.id }},
    userEmail: "{{ customer.email }}",
    platform: "shopify",
    store: "{{ shop.domain }}"
};
</script>
```

### React/Vue/Angular
```javascript
// En tu componente React
const [metadata, setMetadata] = useState(null);

useEffect(() => {
    const userData = {
        clientCode: props.clientId,
        productId: props.productId,
        userEmail: props.userEmail,
        platform: 'react'
    };
    setMetadata(userData);
}, [props]);

// Renderizar chat cuando metadata esté disponible
{metadata && (
    <N8nChatWidget metadata={metadata} />
)}
```

## 🔗 Enlaces Útiles

- [Implementación Simple](../public/n8n-chat-widget-simple-metadata.html)
- [Implementación Simple](../public/n8n-chat-widget-simple-metadata.html)
- [Documentación de n8n Chat](https://www.npmjs.com/package/@n8n/chat) 