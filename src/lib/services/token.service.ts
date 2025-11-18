import Cookies from "js-cookie";

export class TokenService {
  private static readonly TOKEN_KEY = "token";

  // Extrae el primer JWT válido de una cadena que pueda contener basura
  private static extractJwt(input: string | null | undefined): string | null {
    if (!input) return null;
    // JWT regex: header.payload.signature (base64url)
    const match = input.match(/[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/);
    return match ? match[0] : null;
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return;

    // Sanitizar y extraer primer JWT válido
    const clean = this.extractJwt(token) ?? token.trim();

    try {
      localStorage.setItem(this.TOKEN_KEY, clean);
    } catch (err) {
      // Fallback silencioso si localStorage falla
      console.warn("TokenService: no se pudo guardar en localStorage", err);
    }

    // Asegurarse de escribir una cookie con nombre 'token' (no escribir raw cookie sin nombre)
    Cookies.set(this.TOKEN_KEY, clean, {
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookieTokenRaw = Cookies.get(this.TOKEN_KEY) || null;
    const cookieToken = this.extractJwt(cookieTokenRaw) ?? cookieTokenRaw;
    if (cookieToken) return cookieToken;

    const local = localStorage.getItem(this.TOKEN_KEY);
    const localToken = this.extractJwt(local) ?? local;
    return localToken || null;
  }

  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      Cookies.remove(this.TOKEN_KEY);
    }
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }
}
