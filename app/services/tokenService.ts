import { JWTPayload, TokenInfo } from "@/types";
import { decodeJwt, jwtVerify } from "jose";

export class TokenService {
  /**
   * Decode JWT token using jose library
   * This provides better security and validation than manual parsing
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      // Use jose to decode the JWT
      const payload = decodeJwt(token);

      // Validate that the payload has the expected structure
      if (!payload || typeof payload !== "object") {
        console.error("Invalid JWT payload structure");
        return null;
      }

      // Map the standard JWT payload to our custom interface
      const typedPayload: JWTPayload = {
        IdUser: payload.IdUser as string,
        unique_name: payload.unique_name as string,
        Document: payload.Document as string,
        FirstName: payload.FirstName as string,
        LastName: payload.LastName as string,
        email: payload.email as string,
        role: payload.role as string,
        nbf: payload.nbf as number,
        exp: payload.exp as number,
        iat: payload.iat as number,
      };

      return typedPayload;
    } catch (error) {
      console.error("Error decoding JWT token with jose:", error);
      return null;
    }
  }

  /**
   * Verify and decode JWT token with optional secret validation
   * Note: For client-side use without secret, use decodeToken instead
   */
  static async verifyToken(
    token: string,
    secret?: string
  ): Promise<JWTPayload | null> {
    try {
      if (!secret) {
        // If no secret provided, just decode without verification
        return this.decodeToken(token);
      }

      // Verify with secret (for server-side use)
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey);

      // Map to our custom interface
      const typedPayload: JWTPayload = {
        IdUser: payload.IdUser as string,
        unique_name: payload.unique_name as string,
        Document: payload.Document as string,
        FirstName: payload.FirstName as string,
        LastName: payload.LastName as string,
        email: payload.email as string,
        role: payload.role as string,
        nbf: payload.nbf as number,
        exp: payload.exp as number,
        iat: payload.iat as number,
      };

      return typedPayload;
    } catch (error) {
      console.error("Error verifying JWT token:", error);
      return null;
    }
  }

  /**
   * Check if token is expired using jose's built-in validation
   */
  static isTokenExpired(payload: JWTPayload): boolean {
    if (!payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Check if token is valid (properly formatted and not expired)
   */
  static isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);

      if (!payload) {
        return false;
      }

      // Check if token is expired
      if (this.isTokenExpired(payload)) {
        console.warn("Token is expired");
        return false;
      }

      // Check if required fields are present
      if (!payload.IdUser || !payload.email || !payload.unique_name) {
        console.warn("Token missing required fields");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }

  /**
   * Get user display name from token
   */
  static getUserDisplayName(payload: JWTPayload): string {
    const firstName = payload.FirstName?.trim() || "";
    const lastName = payload.LastName?.trim() || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) {
      return firstName;
    }

    if (lastName) {
      return lastName;
    }

    // Fallback to unique_name if no first/last name
    return payload.unique_name?.trim() || "Usuario";
  }

  /**
   * Extract user data from token for chat metadata
   */
  static extractUserDataFromToken(payload: JWTPayload) {
    return {
      IdUser: payload.IdUser,
      Document: payload.Document,
      FirstName: payload.FirstName,
      LastName: payload.LastName,
      email: payload.email,
      userName: payload.unique_name?.trim() || "",
      displayName: this.getUserDisplayName(payload),
      role: payload.role,
    };
  }

  /**
   * Get token expiration date
   */
  static getTokenExpirationDate(payload: JWTPayload): Date | null {
    if (!payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  /**
   * Get token issued date
   */
  static getTokenIssuedDate(payload: JWTPayload): Date | null {
    if (!payload.iat) {
      return null;
    }

    return new Date(payload.iat * 1000);
  }

  /**
   * Get time until token expires (in seconds)
   */
  static getTimeUntilExpiration(payload: JWTPayload): number | null {
    if (!payload.exp) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = payload.exp - currentTime;

    return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
  }

  /**
   * Format token info for debugging
   */
  static getTokenInfo(token: string): TokenInfo | null {
    try {
      const payload = this.decodeToken(token);

      if (!payload) {
        return null;
      }

      return {
        user: this.getUserDisplayName(payload),
        email: payload.email,
        role: payload.role,
        userId: payload.IdUser,
        issuedAt: this.getTokenIssuedDate(payload),
        expiresAt: this.getTokenExpirationDate(payload),
        timeUntilExpiration: this.getTimeUntilExpiration(payload),
        isValid: this.isTokenValid(token),
        isExpired: this.isTokenExpired(payload),
      };
    } catch (error) {
      console.error("Error getting token info:", error);
      return null;
    }
  }
}
