/**
 * Ejemplo de uso del token JWT con la librería jose
 * Este archivo muestra cómo usar el TokenService mejorado con jose
 */

import { TokenService } from "@/app/services/tokenService";

// Ejemplo del token proporcionado por el usuario
const exampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZFVzZXIiOiI1MTYiLCJ1bmlxdWVfbmFtZSI6IklIRVJOQU5ERVpDUzMgICAgICAgIiwiRG9jdW1lbnQiOiIxMjM0MDkzNTkzIiwiRmlyc3ROYW1lIjoiSVNBw60gQkVSTkFSRE8iLCJMYXN0TmFtZSI6IkhFUk5BTkRFWiBHQVJDw61BIiwiZW1haWwiOiJpaGVybmFuZGV6QGNvbWVyY2lhbGl6YWRvcmEtczMuY29tIiwicm9sZSI6IlVzdWFyaW8iLCJuYmYiOjE3NTIyNTIzODAsImV4cCI6MTc1NDkzMDc4MCwiaWF0IjoxNzUyMjUyMzgwfQ.example-signature";

// Ejemplo 1: Desencriptar token con jose
export function exampleDecodeToken() {
  console.log("=== Ejemplo 1: Desencriptar Token con jose ===");

  const payload = TokenService.decodeToken(exampleToken);

  if (payload) {
    console.log("✅ Token desencriptado exitosamente con jose:");
    console.log("- ID Usuario:", payload.IdUser);
    console.log("- Nombre único:", payload.unique_name);
    console.log("- Documento:", payload.Document);
    console.log(
      "- Nombre completo:",
      `${payload.FirstName} ${payload.LastName}`
    );
    console.log("- Email:", payload.email);
    console.log("- Rol:", payload.role);
  } else {
    console.error("❌ Error al desencriptar el token");
  }
}

// Ejemplo 2: Información completa del token
export function exampleGetTokenInfo() {
  console.log("\n=== Ejemplo 2: Información Completa del Token ===");

  const tokenInfo = TokenService.getTokenInfo(exampleToken);

  if (tokenInfo) {
    console.log("📋 Información del token:");
    console.log(JSON.stringify(tokenInfo, null, 2));
  } else {
    console.error("❌ Error al obtener información del token");
  }
}

// Ejemplo 3: Validar token con jose
export function exampleValidateToken() {
  console.log("\n=== Ejemplo 3: Validar Token con jose ===");

  const isValid = TokenService.isTokenValid(exampleToken);
  console.log("¿Token válido?", isValid ? "✅ SÍ" : "❌ NO");

  if (!isValid) {
    const payload = TokenService.decodeToken(exampleToken);
    if (payload) {
      const isExpired = TokenService.isTokenExpired(payload);
      console.log("¿Token expirado?", isExpired ? "⏰ SÍ" : "✅ NO");

      const timeUntilExpiration = TokenService.getTimeUntilExpiration(payload);
      if (timeUntilExpiration !== null) {
        console.log(
          "Tiempo hasta expiración:",
          timeUntilExpiration,
          "segundos"
        );
      }
    }
  }
}

// Ejemplo 4: Fechas del token
export function exampleTokenDates() {
  console.log("\n=== Ejemplo 4: Fechas del Token ===");

  const payload = TokenService.decodeToken(exampleToken);
  if (payload) {
    const issuedAt = TokenService.getTokenIssuedDate(payload);
    const expiresAt = TokenService.getTokenExpirationDate(payload);
    const timeUntilExpiration = TokenService.getTimeUntilExpiration(payload);

    console.log("📅 Fechas del token:");
    console.log("- Expedido:", issuedAt?.toLocaleString() || "N/A");
    console.log("- Expira:", expiresAt?.toLocaleString() || "N/A");
    console.log(
      "- Tiempo restante:",
      timeUntilExpiration ? `${timeUntilExpiration}s` : "N/A"
    );
  }
}

// Ejemplo 5: Verificación con secreto (para server-side)
export async function exampleVerifyToken() {
  console.log("\n=== Ejemplo 5: Verificación con Secreto ===");

  // Solo para demostración - en producción el secreto vendría de variables de entorno
  const mockSecret = "your-secret-key";

  try {
    const payload = await TokenService.verifyToken(exampleToken, mockSecret);

    if (payload) {
      console.log("✅ Token verificado exitosamente");
      console.log("Usuario:", TokenService.getUserDisplayName(payload));
    } else {
      console.log("❌ Token no válido o secreto incorrecto");
    }
  } catch (error) {
    console.log("⚠️ Error en verificación:", error);
  }
}

// Ejemplo 6: Extraer datos para chat
export function exampleExtractUserData() {
  console.log("\n=== Ejemplo 6: Extraer Datos para Chat ===");

  const payload = TokenService.decodeToken(exampleToken);
  if (payload) {
    const userData = TokenService.extractUserDataFromToken(payload);
    console.log("👤 Datos del usuario extraídos:");
    console.log(JSON.stringify(userData, null, 2));
  }
}

// Ejemplo 7: Uso completo con jose
export function exampleCompleteUsage() {
  console.log("\n=== Ejemplo 7: Uso Completo con jose ===");

  const receivedToken = exampleToken;

  // 1. Obtener información completa del token
  const tokenInfo = TokenService.getTokenInfo(receivedToken);

  if (!tokenInfo) {
    console.error("❌ Error al procesar token");
    return;
  }

  console.log("📊 Análisis del token:");
  console.log("- Usuario:", tokenInfo.user);
  console.log("- Email:", tokenInfo.email);
  console.log("- Rol:", tokenInfo.role);
  console.log("- Válido:", tokenInfo.isValid ? "✅" : "❌");
  console.log("- Expirado:", tokenInfo.isExpired ? "⏰" : "✅");

  if (!tokenInfo.isValid) {
    console.warn("⚠️ Token no válido, usando valores por defecto");
    return;
  }

  // 2. Extraer datos para uso en la aplicación
  const payload = TokenService.decodeToken(receivedToken);
  if (payload) {
    const userData = TokenService.extractUserDataFromToken(payload);

    // 3. Crear metadata para chat
    const chatMetadata = {
      CliCod: 20115,
      PrdCod: 4,
      Email: userData.email,
      userName: userData.userName,
      timestamp: new Date().toISOString(),
      sessionId: "example-session-id",
      // Nuevos campos del token
      IdUser: userData.IdUser,
      Document: userData.Document,
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      role: userData.role,
    };

    console.log("📤 Metadata para chat:");
    console.log(JSON.stringify(chatMetadata, null, 2));

    // 4. Mensaje de bienvenida personalizado
    const welcomeMessage = `¡Hola ${userData.displayName}! Bienvenido al Asistente Clave. Tu rol es: ${userData.role}`;
    console.log("👋 Mensaje de bienvenida:", welcomeMessage);
  }
}

// Ejemplo 8: Monitoreo de expiración
export function exampleExpirationMonitoring() {
  console.log("\n=== Ejemplo 8: Monitoreo de Expiración ===");

  const payload = TokenService.decodeToken(exampleToken);
  if (payload) {
    const timeUntilExpiration = TokenService.getTimeUntilExpiration(payload);

    if (timeUntilExpiration === null) {
      console.log("⚠️ Token sin fecha de expiración");
      return;
    }

    const minutes = Math.floor(timeUntilExpiration / 60);
    const seconds = timeUntilExpiration % 60;

    console.log(`⏱️ Tiempo restante: ${minutes}m ${seconds}s`);

    if (timeUntilExpiration < 300) {
      // 5 minutos
      console.log("🚨 Token expirará pronto, considere renovar");
    } else if (timeUntilExpiration <= 0) {
      console.log("⏰ Token expirado");
    } else {
      console.log("✅ Token válido con tiempo suficiente");
    }
  }
}

// Ejecutar todos los ejemplos
export function runAllExamples() {
  console.log("🚀 Ejecutando todos los ejemplos con jose...\n");

  exampleDecodeToken();
  exampleGetTokenInfo();
  exampleValidateToken();
  exampleTokenDates();
  exampleExtractUserData();
  exampleCompleteUsage();
  exampleExpirationMonitoring();
}

// Ejecutar ejemplo de verificación (async)
export async function runAsyncExamples() {
  console.log("\n🔐 Ejecutando ejemplos asíncronos...\n");
  await exampleVerifyToken();
}

// Ejemplo para probar con un token real
export function testWithRealToken(realToken: string) {
  console.log("\n=== 🧪 Prueba con Token Real ===");

  try {
    const tokenInfo = TokenService.getTokenInfo(realToken);

    if (tokenInfo) {
      console.log("✅ Token real procesado exitosamente");
      console.log("📊 Información del token:");
      console.log(JSON.stringify(tokenInfo, null, 2));
    } else {
      console.error("❌ Error al procesar token real");
    }
  } catch (error) {
    console.error("❌ Error al procesar token:", error);
  }
}

// Función de demostración completa
export function demonstrateJoseIntegration() {
  console.log("🎯 Demostración completa de integración con jose\n");

  // Mostrar información de la librería
  console.log("📚 Utilizando librería 'jose' para:");
  console.log("- ✅ Decodificación segura de JWT");
  console.log("- ✅ Validación de estructura");
  console.log("- ✅ Verificación de firmas (opcional)");
  console.log("- ✅ Manejo de fechas y expiración");
  console.log("- ✅ Mejor seguridad y rendimiento\n");

  // Ejecutar ejemplos
  runAllExamples();

  // Ejecutar ejemplos asíncronos
  runAsyncExamples().then(() => {
    console.log("\n🎉 Demostración completada");
  });
}
