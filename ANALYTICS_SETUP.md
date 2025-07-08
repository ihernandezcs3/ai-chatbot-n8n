# Configuración de Analíticas de Vercel

Este proyecto está configurado con analíticas de Vercel para rastrear el uso del chat y obtener insights sobre el comportamiento de los usuarios.

## 🚀 Eventos Rastreados

### Eventos Automáticos
- **page_view**: Se registra automáticamente cuando se carga una página
- **chat_session_started**: Cuando un usuario inicia una nueva sesión de chat

### Eventos del Chat
- **chat_message_sent**: Cuando un usuario envía un mensaje
  - Propiedades: `messageLength`, `sessionId`
- **chat_response_received**: Cuando se recibe una respuesta exitosa del AI
  - Propiedades: `hasComponents`, `isMarkdown`, `responseLength`, `sessionId`
- **chat_error**: Cuando ocurre un error en el chat
  - Propiedades: `error`, `sessionId`

## 📊 Cómo Ver las Analíticas

1. **Dashboard de Vercel**: Ve a tu proyecto en Vercel Dashboard
2. **Sección Analytics**: Navega a la pestaña "Analytics"
3. **Eventos Personalizados**: Ve a "Events" para ver los eventos del chat
4. **Filtros**: Usa `sessionId` para agrupar eventos por sesión

## 🔧 Configuración

### Variables de Entorno
No se requieren variables de entorno adicionales. Las analíticas funcionan automáticamente en producción.

### Desarrollo Local
Las analíticas también funcionan en desarrollo local para testing.

## 📈 Métricas Importantes

### Uso del Chat
- **Mensajes por sesión**: Promedio de mensajes enviados por sesión
- **Tiempo de respuesta**: Tiempo entre mensaje enviado y respuesta recibida
- **Tasa de error**: Porcentaje de errores vs respuestas exitosas

### Tipos de Respuesta
- **Respuestas con Markdown**: Frecuencia de respuestas que contienen Markdown
- **Respuestas con Componentes**: Frecuencia de respuestas con componentes dinámicos
- **Longitud de respuestas**: Distribución de longitudes de respuesta

## 🛠️ Uso del Tracking

### En Componentes
```typescript
import { trackChatEvent } from './components/AnalyticsProvider';

// Track custom event
trackChatEvent('custom_event', {
  property1: 'value1',
  property2: 'value2'
});
```

### Eventos Globales
```typescript
// Access from window object
(window as any).trackChatEvent('global_event', {
  data: 'example'
});
```

## 🔒 Privacidad

- **No se rastrea contenido**: Solo se rastrea la longitud de los mensajes, no el contenido
- **Session ID**: Se usa un ID de sesión aleatorio para agrupar eventos
- **Sin PII**: No se recopila información personal identificable

## 🚨 Troubleshooting

### Las analíticas no aparecen
1. Verifica que el proyecto esté desplegado en Vercel
2. Confirma que `@vercel/analytics` esté instalado
3. Revisa la consola del navegador para errores

### Eventos no se registran
1. Verifica la conexión a internet
2. Confirma que no haya bloqueadores de anuncios activos
3. Revisa que el componente `Analytics` esté en el layout

## 📚 Recursos Adicionales

- [Documentación oficial de Vercel Analytics](https://vercel.com/docs/analytics)
- [Guía de eventos personalizados](https://vercel.com/docs/analytics/events)
- [Dashboard de analíticas](https://vercel.com/dashboard) 