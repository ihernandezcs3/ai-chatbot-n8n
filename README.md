# Chat IA - Integración con N8N

Aplicación de chat inteligente desarrollada con Next.js que se integra con N8N para procesar mensajes y respuestas dinámicas. Esta aplicación está diseñada para funcionar como un iframe dentro de otras aplicaciones (como Siaffe).

## Características

- 💬 Chat interactivo con interfaz moderna
- 🤖 Integración con agente IA a través de N8N
- 📱 Diseño responsive
- 🎨 Componentes dinámicos renderizables
- 📊 Sistema de analytics integrado
- 🔄 Comunicación bidireccional con aplicación padre
- 📝 Soporte para Markdown en respuestas

## Integración como Iframe

Esta aplicación está diseñada para funcionar como un iframe dentro de otras aplicaciones. Utiliza `postMessage` para comunicarse con la aplicación padre y recibir datos como:

- `CliCod`: Código del cliente
- `PrdCod`: Código del producto  
- `Email`: Email del usuario
- `userName`: Nombre del usuario (opcional)

### Documentación de Integración

Consulta [IFRAME_INTEGRATION.md](./IFRAME_INTEGRATION.md) para obtener información detallada sobre cómo integrar esta aplicación en tu proyecto.

## Getting Started

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd ai-chatbot-n8n
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Pruebas de Integración

Para probar la integración como iframe, puedes usar el archivo `test-iframe.html` incluido en el proyecto:

1. Inicia el servidor de desarrollo
2. Abre `test-iframe.html` en tu navegador
3. Usa los controles para enviar datos al chat y probar la comunicación

## Estructura del Proyecto

```
ai-chatbot-n8n/
├── app/
│   ├── api/chat/route.ts          # API endpoint para el chat
│   ├── components/
│   │   ├── ChatInterface.tsx      # Componente principal del chat
│   │   ├── ParentDataContext.tsx  # Contexto para datos del padre
│   │   ├── DynamicComponentRenderer.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── AnalyticsProvider.tsx
│   └── page.tsx                   # Página principal
├── types/
│   └── AgentResponse.ts           # Tipos TypeScript
├── test-iframe.html               # Archivo de prueba para iframe
├── IFRAME_INTEGRATION.md          # Documentación de integración
└── README.md
```

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **PostMessage API** - Comunicación entre iframe y padre

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# URL del webhook de N8N
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/chat
```

### Personalización

- **Logo**: Reemplaza `/public/logo_cs3.png` con tu logo
- **Colores**: Modifica las clases de Tailwind en los componentes
- **Analytics**: Configura el tracking en `AnalyticsProvider.tsx`

## API

### Endpoint: `/api/chat`

**Método:** POST

**Body:**
```json
{
  "sessionId": "string",
  "chatInput": "string",
  "metadata": {
    "CliCod": "number",
    "PrdCod": "number", 
    "Email": "string",
    "userName": "string",
    "timestamp": "string",
    "sessionId": "string"
  }
}
```

**Respuesta:**
```json
{
  "output": "string",
  "actions": "array",
  "components": "array (opcional)"
}
```

## Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

### Estructura de Componentes

- **ChatInterface**: Componente principal que maneja la interfaz del chat
- **ParentDataContext**: Contexto para manejar datos recibidos del padre
- **DynamicComponentRenderer**: Renderiza componentes dinámicos
- **MarkdownRenderer**: Renderiza contenido Markdown
- **AnalyticsProvider**: Maneja eventos de analytics

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores

La aplicación es compatible con cualquier proveedor que soporte Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas sobre la integración, consulta:

- [IFRAME_INTEGRATION.md](./IFRAME_INTEGRATION.md) - Documentación de integración
- [Issues del repositorio](https://github.com/tu-usuario/ai-chatbot-n8n/issues) - Reportar bugs o solicitar features
