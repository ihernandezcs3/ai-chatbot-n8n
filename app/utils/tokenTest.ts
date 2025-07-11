/**
 * Test suite para verificar la integración con la librería jose
 */

import { TokenService } from "@/app/services/tokenService";

// Token de ejemplo válido (estructura correcta pero firma de ejemplo)
const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZFVzZXIiOiI1MTYiLCJ1bmlxdWVfbmFtZSI6IklIRVJOQU5ERVpDUzMgICAgICAgIiwiRG9jdW1lbnQiOiIxMjM0MDkzNTkzIiwiRmlyc3ROYW1lIjoiSVNBw60gQkVSTkFSRE8iLCJMYXN0TmFtZSI6IkhFUk5BTkRFWiBHQVJDw61BIiwiZW1haWwiOiJpaGVybmFuZGV6QGNvbWVyY2lhbGl6YWRvcmEtczMuY29tIiwicm9sZSI6IlVzdWFyaW8iLCJuYmYiOjE3NTIyNTIzODAsImV4cCI6MTc1NDkzMDc4MCwiaWF0IjoxNzUyMjUyMzgwfQ.example-signature";

// Token inválido (formato incorrecto)
const invalidToken = "invalid-token-format";

// Token expirado (para testing)
const expiredToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZFVzZXIiOiI1MTYiLCJ1bmlxdWVfbmFtZSI6IklIRVJOQU5ERVpDUzMiLCJleHAiOjE2MDk0NTkyMDB9.example-signature";

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  error?: string;
}

export class TokenServiceTest {
  private static results: TestResult[] = [];

  static runAllTests(): TestResult[] {
    console.log("🧪 Ejecutando pruebas de TokenService con jose...\n");

    this.results = [];

    // Pruebas básicas
    this.testDecodeValidToken();
    this.testDecodeInvalidToken();
    this.testTokenValidation();
    this.testUserDisplayName();
    this.testExtractUserData();
    this.testTokenInfo();
    this.testTokenDates();
    this.testTimeUntilExpiration();

    // Mostrar resumen
    this.showTestSummary();

    return this.results;
  }

  private static addResult(
    name: string,
    passed: boolean,
    message: string,
    error?: string
  ) {
    this.results.push({ name, passed, message, error });
    const icon = passed ? "✅" : "❌";
    console.log(`${icon} ${name}: ${message}`);
    if (error) {
      console.log(`   Error: ${error}`);
    }
  }

  private static testDecodeValidToken() {
    try {
      const payload = TokenService.decodeToken(validToken);

      if (payload && payload.IdUser === "516") {
        this.addResult(
          "Decodificar token válido",
          true,
          "Token decodificado correctamente con jose"
        );
      } else {
        this.addResult(
          "Decodificar token válido",
          false,
          "Token no decodificado o datos incorrectos"
        );
      }
    } catch (error) {
      this.addResult(
        "Decodificar token válido",
        false,
        "Error al decodificar token",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testDecodeInvalidToken() {
    try {
      const payload = TokenService.decodeToken(invalidToken);

      if (payload === null) {
        this.addResult(
          "Rechazar token inválido",
          true,
          "Token inválido rechazado correctamente"
        );
      } else {
        this.addResult(
          "Rechazar token inválido",
          false,
          "Token inválido no fue rechazado"
        );
      }
    } catch (error) {
      this.addResult(
        "Rechazar token inválido",
        true,
        "Token inválido rechazado con excepción (comportamiento esperado)"
      );
    }
  }

  private static testTokenValidation() {
    try {
      const isValidToken = TokenService.isTokenValid(validToken);
      const isInvalidToken = TokenService.isTokenValid(invalidToken);

      if (isValidToken && !isInvalidToken) {
        this.addResult(
          "Validación de tokens",
          true,
          "Validación funciona correctamente"
        );
      } else {
        this.addResult(
          "Validación de tokens",
          false,
          `Valid: ${isValidToken}, Invalid: ${isInvalidToken}`
        );
      }
    } catch (error) {
      this.addResult(
        "Validación de tokens",
        false,
        "Error en validación",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testUserDisplayName() {
    try {
      const payload = TokenService.decodeToken(validToken);

      if (payload) {
        const displayName = TokenService.getUserDisplayName(payload);
        const expected = "ISAÍ BERNARDO HERNANDEZ GARCÍA";

        if (displayName === expected) {
          this.addResult(
            "Nombre de usuario",
            true,
            `Nombre extraído: "${displayName}"`
          );
        } else {
          this.addResult(
            "Nombre de usuario",
            false,
            `Esperado: "${expected}", Obtenido: "${displayName}"`
          );
        }
      } else {
        this.addResult(
          "Nombre de usuario",
          false,
          "No se pudo decodificar el token"
        );
      }
    } catch (error) {
      this.addResult(
        "Nombre de usuario",
        false,
        "Error al extraer nombre",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testExtractUserData() {
    try {
      const payload = TokenService.decodeToken(validToken);

      if (payload) {
        const userData = TokenService.extractUserDataFromToken(payload);

        if (
          userData.IdUser === "516" &&
          userData.email === "ihernandez@comercializadora-s3.com" &&
          userData.role === "Usuario"
        ) {
          this.addResult(
            "Extraer datos de usuario",
            true,
            "Datos extraídos correctamente"
          );
        } else {
          this.addResult(
            "Extraer datos de usuario",
            false,
            "Datos extraídos no coinciden con los esperados"
          );
        }
      } else {
        this.addResult(
          "Extraer datos de usuario",
          false,
          "No se pudo decodificar el token"
        );
      }
    } catch (error) {
      this.addResult(
        "Extraer datos de usuario",
        false,
        "Error al extraer datos",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testTokenInfo() {
    try {
      const tokenInfo = TokenService.getTokenInfo(validToken);

      if (
        tokenInfo &&
        tokenInfo.userId === "516" &&
        tokenInfo.email === "ihernandez@comercializadora-s3.com"
      ) {
        this.addResult(
          "Información del token",
          true,
          "Información completa extraída correctamente"
        );
      } else {
        this.addResult(
          "Información del token",
          false,
          "Información del token incompleta o incorrecta"
        );
      }
    } catch (error) {
      this.addResult(
        "Información del token",
        false,
        "Error al obtener información",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testTokenDates() {
    try {
      const payload = TokenService.decodeToken(validToken);

      if (payload) {
        const issuedAt = TokenService.getTokenIssuedDate(payload);
        const expiresAt = TokenService.getTokenExpirationDate(payload);

        if (issuedAt && expiresAt) {
          this.addResult(
            "Fechas del token",
            true,
            `Expedido: ${issuedAt.toLocaleDateString()}, Expira: ${expiresAt.toLocaleDateString()}`
          );
        } else {
          this.addResult(
            "Fechas del token",
            false,
            "No se pudieron extraer las fechas"
          );
        }
      } else {
        this.addResult(
          "Fechas del token",
          false,
          "No se pudo decodificar el token"
        );
      }
    } catch (error) {
      this.addResult(
        "Fechas del token",
        false,
        "Error al extraer fechas",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static testTimeUntilExpiration() {
    try {
      const payload = TokenService.decodeToken(validToken);

      if (payload) {
        const timeUntilExpiration =
          TokenService.getTimeUntilExpiration(payload);

        if (timeUntilExpiration !== null) {
          this.addResult(
            "Tiempo hasta expiración",
            true,
            `${timeUntilExpiration} segundos hasta expiración`
          );
        } else {
          this.addResult(
            "Tiempo hasta expiración",
            false,
            "No se pudo calcular el tiempo hasta expiración"
          );
        }
      } else {
        this.addResult(
          "Tiempo hasta expiración",
          false,
          "No se pudo decodificar el token"
        );
      }
    } catch (error) {
      this.addResult(
        "Tiempo hasta expiración",
        false,
        "Error al calcular tiempo",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private static showTestSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📊 Resumen de pruebas:`);
    console.log(`- Total: ${totalTests}`);
    console.log(`- Pasaron: ${passedTests} ✅`);
    console.log(`- Fallaron: ${failedTests} ❌`);
    console.log(
      `- Porcentaje: ${Math.round((passedTests / totalTests) * 100)}%`
    );

    if (failedTests === 0) {
      console.log(
        `\n🎉 ¡Todas las pruebas pasaron! La integración con jose funciona correctamente.`
      );
    } else {
      console.log(`\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.`);
    }
  }

  static testSpecificToken(
    token: string,
    description: string = "Token personalizado"
  ) {
    console.log(`\n🔍 Probando ${description}...`);

    try {
      const tokenInfo = TokenService.getTokenInfo(token);

      if (tokenInfo) {
        console.log("✅ Token procesado exitosamente");
        console.log("📋 Información:");
        console.log(`- Usuario: ${tokenInfo.user}`);
        console.log(`- Email: ${tokenInfo.email}`);
        console.log(`- Rol: ${tokenInfo.role}`);
        console.log(`- Válido: ${tokenInfo.isValid ? "✅" : "❌"}`);
        console.log(`- Expirado: ${tokenInfo.isExpired ? "⏰" : "✅"}`);

        if (tokenInfo.timeUntilExpiration !== null) {
          const minutes = Math.floor(tokenInfo.timeUntilExpiration / 60);
          const seconds = tokenInfo.timeUntilExpiration % 60;
          console.log(`- Tiempo restante: ${minutes}m ${seconds}s`);
        }
      } else {
        console.log("❌ No se pudo procesar el token");
      }
    } catch (error) {
      console.log("❌ Error al procesar token:", error);
    }
  }
}

// Función de conveniencia para ejecutar todas las pruebas
export function runTokenTests() {
  return TokenServiceTest.runAllTests();
}

// Función para probar un token específico
export function testToken(token: string, description?: string) {
  TokenServiceTest.testSpecificToken(token, description);
}
