# Documentación del Proyecto: AI Chatbot n8n Integration

## 1. Descripción General del Proyecto

Este proyecto es una interfaz de chat inteligente desarrollada en **Next.js** que se integra con un backend de automatización en **n8n**. Su propósito principal es servir como un asistente virtual capaz de interactuar con usuarios, procesar consultas mediante IA y mantener un historial de conversación.

La aplicación opera bajo dos modalidades principales:

1.  **Modo Iframe**: Diseñada para ser incrustada dentro de aplicaciones anfitrionas (como sistemas empresariales).
2.  **Modo Standalone**: Funciona en una ventana independiente pero requiere que se le pasen las credenciales y el token de sesión desde la aplicación anfitriona para funcionar. No es una aplicación pública independiente.

El sistema utiliza **Supabase (PostgreSQL)** para la persistencia del historial de conversaciones y **n8n** como orquestador de la lógica de negocio y la IA.

---

## 2. Arquitectura del Sistema

### Componentes Principales

- **Frontend (Next.js)**: Maneja la interfaz de usuario, el renderizado de mensajes (texto, markdown, componentes dinámicos) y la gestión del estado de la conversación.
- **Backend (Next.js API Routes)**:
  - `/api/chat`: Proxy para enviar mensajes al webhook de n8n.
  - `/api/conversations`: Gestiona el historial de conversaciones almacenado en Supabase.
  - `/api/ratings`: Gestiona las calificaciones de las respuestas.
- **Base de Datos (Supabase)**: Almacena el historial de chats para persistencia entre sesiones y métricas de uso.
- **Motor de IA (n8n)**: Recibe los mensajes del usuario, procesa la lógica con LLMs (como GPT o Claude) y devuelve la respuesta estructurada.

### Modos de Operación

#### Modo Iframe (Principal)

La aplicación se carga dentro de un `<iframe>` en la aplicación anfitriona. Se comunica mediante la API `window.postMessage` para recibir:

- Datos del usuario (nombre, email, ID).
- Token JWT de autenticación.
- Contexto de la sesión (Códigos de cliente/producto).

#### Modo Standalone

Ubicado en la ruta `/standalone`. Es una vista de pantalla completa que **requiere** recibir la información de sesión para inicializarse. Si se intenta acceder directamente sin parámetros o credenciales válidas, no funcionará correctamente o usará valores por defecto limitados.

---

## 3. Instalación y Configuración Local

### Prerrequisitos

- Node.js 18 o superior.
- Cuenta de Supabase y conexión a base de datos PostgreSQL.
- Instancia de n8n con el workflow del chat configurado.

### Pasos de Instalación

1.  **Clonar el repositorio**:

    ```bash
    git clone <url-del-repositorio>
    cd ai-chatbot-n8n
    ```

2.  **Instalar dependencias**:

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz del proyecto. **Es CRÍTICO que configures la conexión a la base de datos correctamente**.

    ```env
    # Conexión a Base de Datos Supabase
    DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

    # URL del Webhook de n8n (Producción/Dev)
    N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/chat

    # API Key de Gemini (Opcional, para análisis de calificaciones)
    GEMINI_API_KEY=tu_api_key_de_gemini
    ```

4.  **Ejecutar Migraciones de Base de Datos**:
    Para que el historial de chat y las calificaciones funcionen, debes crear las tablas necesarias en Supabase.

    Puedes ejecutar los scripts SQL ubicados en la carpeta `migrations/` manualmente en el SQL Editor de Supabase o usar un cliente SQL:

    - `migrations/001_create_conversations.sql`: Crea la tabla de conversaciones.
    - `migrations/002_create_response_ratings.sql`: Crea la tabla de calificaciones de respuestas.

5.  **Iniciar Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

---

## 4. Base de Datos (Supabase)

El proyecto utiliza una base de datos PostgreSQL alojada en Supabase.

**Connection String:**
`postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Esquema Principal

- **`conversations`**: Almacena los metadatos de las sesiones de chat.

  - `id` (UUID): Identificador único interno.
  - `session_id` (Text): ID de sesión compartido con n8n.
  - `user_id` (Text): ID del usuario propietario.
  - `title` (Text): Título autogenerado de la conversación.
  - `created_at`, `updated_at`.

- **`n8n_chat_histories`**: (Tabla gestionada por n8n) Almacena los mensajes individuales.

  - `sessionId`: Vincula con `conversations`.
  - `message`: Contenido JSON del mensaje.

- **`response_ratings`**: Almacena el feedback de los usuarios sobre las respuestas.
  - `rating`: 'positive' | 'negative'.
  - `feedback_text`: Comentario opcional del usuario.
  - `message_content`, `user_question`: Contexto de la calificación.

---

## 5. Autenticación y Tokens JWT

El sistema no maneja un login propio, sino que confía en la autenticación de la aplicación anfitriona a través de Tokens JWT.

### Recepción de Datos

La aplicación espera recibir un mensaje `postMessage` con el tipo `token` que contiene un JWT firmado.

**Estructura del Payload del Token:**

```json
{
  "IdUser": "516",
  "unique_name": "USUARIO",
  "email": "usuario@empresa.com",
  "FirstName": "NOMBRE",
  "LastName": "APELLIDO",
  "role": "Usuario",
  ...
}
```

El servicio `TokenService` (`app/services/tokenService.ts`) se encarga de decodificar este token usando la librería `jose` y extraer la información del usuario para personalizar la experiencia y enviarla como contexto a n8n.

---

## 6. Estructura del Proyecto

Archivos y directorios clave:

- **`app/`**: Código fuente principal (Next.js App Router).

  - **`api/`**: Endpoints de backend (`chat`, `conversations`, `ratings`).
  - **`components/`**: Componentes de UI.
    - `ChatInterface.tsx`: Componente central del chat.
    - `ui/RatingButtons.tsx`: Componente de feedback (pulgar arriba/abajo).
    - `ui/MessageBubble.tsx`: Renderizado de mensajes individuales.
  - **`dashboard/`**: Panel de métricas y análisis de calidad (`/dashboard`).
  - **`hooks/`**: Custom hooks (`useChat`, `useUserData`, `useSpeechRecognition`).
  - **`services/`**: Lógica de negocio y llamadas a API (`chatService`, `ratingService`, `tokenService`).
  - **`standalone/`**: Página para el modo ventana independiente.

- **`migrations/`**: Scripts SQL para configuración de base de datos.
- **`public/`**: Assets estáticos.
- **`types/`**: Definiciones de tipos TypeScript.

---

## 7. Dashboard de Calidad

El proyecto incluye un dashboard accesible en `/dashboard` para monitorear la calidad de las respuestas del bot.

**Funcionalidades:**

- Visualización de calificaciones positivas/negativas.
- Gráficos de tendencia.
- Análisis detallado de feedback negativo.
- **Integración con AI (Gemini)**: Utiliza la API de Google Gemini para analizar automáticamente los comentarios negativos y sugerir mejoras (accesible mediante el botón "Analizar con IA").

---

## 8. Despliegue

La aplicación está optimizada para ser desplegada en **Vercel**.

1.  Conectar el repositorio a Vercel.
2.  Configurar las variables de entorno en el panel de Vercel (copiar las del paso 3 de instalación).
3.  Desplegar.

Al desplegar, asegúrate de que la URL de tu aplicación esté permitida en las políticas de CORS o `frame-ancestors` si la aplicación anfitriona tiene restricciones de seguridad estrictas.
