import Cookies from "js-cookie";

export class TokenService {
  private static readonly TOKEN_KEY = "token";

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);

      Cookies.set(this.TOKEN_KEY, token, {
        expires: 7, // 7 días
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      const cookieToken = Cookies.get(this.TOKEN_KEY);
      if (cookieToken) return cookieToken;

      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
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
