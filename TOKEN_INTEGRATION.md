# Integración de Token JWT

## Descripción

Este documento describe cómo se integró el manejo de tokens JWT en la aplicación para extraer información del usuario automáticamente, eliminando la necesidad de enviar `email` y `userName` por separado.

La implementación utiliza la librería **`jose`** para un manejo seguro y eficiente de los tokens JWT.

## Librería jose

### ¿Por qué jose?

- **🔒 Seguridad**: Implementación robusta siguiendo estándares JWT
- **⚡ Rendimiento**: Optimizada y ligera (~20kb)
- **🛡️ Validación**: Verificación automática de estructura y firmas
- **📅 Fechas**: Manejo automático de expiración y validez
- **🔧 TypeScript**: Soporte nativo para TypeScript
- **🌐 Estándares**: Cumple con RFC 7519 y especificaciones JOSE

### Instalación

```bash
npm install jose
```

## Estructura del Token

El token JWT contiene la siguiente información:

```json
{
  "IdUser": "516",
  "unique_name": "IHERNANDEZCS3       ",
  "Document": "1234093593",
  "FirstName": "ISAÍ BERNARDO",
  "LastName": "HERNANDEZ GARCÍA",
  "email": "ihernandez@comercializadora-s3.com",
  "role": "Usuario",
  "nbf": 1752252380,
  "exp": 1754930780,
  "iat": 1752252380
}
```

## Archivos Modificados

### 1. Tipos (`types/index.ts`)
- ✅ Agregado `JWTPayload` interface
- ✅ Actualizado `UserData` para incluir `tokenPayload`
- ✅ Actualizado `ChatMetadata` con nuevos campos del token

### 2. Servicio de Token (`app/services/tokenService.ts`) - **NUEVO**
- ✅ `decodeToken()` - Desencripta el token JWT usando la librería `jose`
- ✅ `verifyToken()` - Verifica y valida el token con secreto (opcional)
- ✅ `isTokenValid()` - Valida si el token es válido y no expirado
- ✅ `getUserDisplayName()` - Extrae el nombre completo del usuario
- ✅ `extractUserDataFromToken()` - Extrae todos los datos relevantes
- ✅ `getTokenInfo()` - Información completa del token para debugging
- ✅ `getTokenExpirationDate()` - Fecha de expiración del token
- ✅ `getTimeUntilExpiration()` - Tiempo restante hasta expiración

### 3. Servicio de Chat (`app/services/chatService.ts`)
- ✅ Importa `TokenService`
- ✅ Extrae datos del token para metadata
- ✅ Prioriza datos del token sobre valores hardcoded

### 4. Hook de Datos de Usuario (`hooks/useUserData.ts`)
- ✅ Importa tipos y servicios
- ✅ Desencripta token automáticamente al recibirlo
- ✅ Comentados casos de `email` y `userName` (ya no necesarios)

### 5. Pantalla de Bienvenida (`app/components/ui/WelcomeScreen.tsx`)
- ✅ Acepta `userData` como prop
- ✅ Muestra nombre real del usuario extraído del token
- ✅ Maneja fallback para caso sin token

### 6. Página Principal (`app/page.tsx`)
- ✅ Pasa `userData` al componente `WelcomeScreen`

## Flujo de Integración

```mermaid
graph TD
    A[Aplicación Padre] --> B[Envía Token JWT]
    B --> C[useUserData Hook]
    C --> D[TokenService.decodeToken()]
    D --> E[Extrae Payload]
    E --> F[Actualiza userData State]
    F --> G[ChatService usa datos del token]
    F --> H[WelcomeScreen muestra nombre real]
    G --> I[Envía metadata completa a API]
```

## Cambios en el Protocolo de Comunicación

### Antes:
```javascript
// Mensajes separados del padre
window.postMessage({ type: "email", email: "user@example.com" }, "*");
window.postMessage({ type: "userName", userName: "John Doe" }, "*");
window.postMessage({ type: "token", token: "jwt-token" }, "*");
```

### Ahora:
```javascript
// Solo necesita enviar el token
window.postMessage({ type: "token", token: "jwt-token-with-user-data" }, "*");
```

## Prioridad de Datos

La aplicación ahora prioriza los datos en el siguiente orden:

1. **Datos del Token JWT** (primera prioridad)
2. **Datos recibidos por postMessage** (segunda prioridad)
3. **Valores por defecto** (fallback)

## Ejemplo de Uso

```typescript
// En el componente
import { TokenService } from '@/app/services/tokenService';

// Desencriptar token con jose
const payload = TokenService.decodeToken(userToken);

// Obtener información completa del token
const tokenInfo = TokenService.getTokenInfo(userToken);
// {
//   user: "ISAÍ BERNARDO HERNANDEZ GARCÍA",
//   email: "ihernandez@comercializadora-s3.com",
//   role: "Usuario",
//   userId: "516",
//   issuedAt: Date,
//   expiresAt: Date,
//   timeUntilExpiration: 3600,
//   isValid: true,
//   isExpired: false
// }

// Extraer nombre para mostrar
const displayName = TokenService.getUserDisplayName(payload);
// "ISAÍ BERNARDO HERNANDEZ GARCÍA"

// Extraer datos completos
const userData = TokenService.extractUserDataFromToken(payload);
// {
//   IdUser: "516",
//   email: "ihernandez@comercializadora-s3.com",
//   userName: "IHERNANDEZCS3",
//   displayName: "ISAÍ BERNARDO HERNANDEZ GARCÍA",
//   role: "Usuario",
//   ...
// }

// Verificar token con secreto (server-side)
const verifiedPayload = await TokenService.verifyToken(userToken, secretKey);
```

## Validación de Token

```typescript
// Verificar si el token es válido
const isValid = TokenService.isTokenValid(token);

// Verificar si está expirado
const payload = TokenService.decodeToken(token);
const isExpired = TokenService.isTokenExpired(payload);
```

## Metadata de Chat

La metadata enviada al API ahora incluye:

```json
{
  "CliCod": 20115,
  "PrdCod": 4,
  "Email": "ihernandez@comercializadora-s3.com",
  "userName": "IHERNANDEZCS3",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sessionId": "session_abc123",
  "IdUser": "516",
  "Document": "1234093593",
  "FirstName": "ISAÍ BERNARDO",
  "LastName": "HERNANDEZ GARCÍA",
  "role": "Usuario"
}
```

## Beneficios

### Mejoras con la librería jose

1. **🔒 Seguridad Mejorada**: 
   - Validación automática de estructura JWT
   - Verificación de firmas (opcional)
   - Manejo seguro de fechas y expiración

2. **⚡ Rendimiento**:
   - Decodificación optimizada
   - Menor overhead que implementaciones manuales
   - Validación eficiente

3. **🛡️ Robustez**:
   - Manejo de errores más robusto
   - Compatibilidad con diferentes algoritmos
   - Cumplimiento de estándares JWT

4. **🔧 Funcionalidades Adicionales**:
   - Información detallada del token
   - Monitoreo de expiración
   - Validación de fechas nbf/exp

### Beneficios Generales

1. **Simplicidad**: Solo necesita enviar el token
2. **Seguridad**: Los datos del usuario están encriptados en el token
3. **Consistencia**: Una sola fuente de verdad para los datos del usuario
4. **Mantenibilidad**: Menos mensajes entre iframe y padre
5. **Escalabilidad**: Fácil agregar nuevos campos al token

## Casos de Uso

### Caso 1: Token Válido
```javascript
// Token válido con datos completos
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const payload = TokenService.decodeToken(token);
// ✅ Datos extraídos correctamente
```

### Caso 2: Token Inválido
```javascript
// Token malformado o expirado
const invalidToken = "invalid-token";
const payload = TokenService.decodeToken(invalidToken);
// ❌ null - usa datos por defecto
```

### Caso 3: Sin Token
```javascript
// No se recibe token
const userData = {
  CliCod: 20115,
  PrdCod: 4,
  Email: "default@example.com",
  userName: "Usuario",
  token: "",
  tokenPayload: null
};
// ✅ Usa valores por defecto
```

## Archivo de Ejemplos

Consulta `app/utils/tokenExample.ts` para ver ejemplos completos de uso del `TokenService` en diferentes escenarios.

## Testing

### Testing Automático

Para ejecutar las pruebas automáticas de la integración:

```typescript
import { runTokenTests, testToken } from '@/app/utils/tokenTest';

// Ejecutar todas las pruebas
const results = runTokenTests();

// Probar un token específico
testToken('tu-token-jwt-aqui', 'Mi token de producción');
```

### Testing Manual

Para probar manualmente la integración:

```typescript
import { testWithRealToken, demonstrateJoseIntegration } from '@/app/utils/tokenExample';

// Demostración completa
demonstrateJoseIntegration();

// Probar con tu token real
testWithRealToken('tu-token-jwt-aqui');
```

### Validación con jose

La librería jose proporciona validación automática de:

- ✅ Formato JWT correcto
- ✅ Estructura de payload válida
- ✅ Fechas nbf/exp válidas
- ✅ Algoritmos de firma soportados
- ✅ Campos requeridos presentes

## Migración

Si tienes código existente que usa `email` y `userName` por separado:

### Antes:
```typescript
const metadata = {
  Email: userData.Email,
  userName: userData.userName,
};
```

### Después:
```typescript
const tokenData = userData.tokenPayload 
  ? TokenService.extractUserDataFromToken(userData.tokenPayload) 
  : null;
  
const metadata = {
  Email: tokenData?.email || userData.Email,
  userName: tokenData?.userName || userData.userName,
  // Nuevos campos disponibles
  IdUser: tokenData?.IdUser,
  FirstName: tokenData?.FirstName,
  LastName: tokenData?.LastName,
  role: tokenData?.role,
};
``` 