"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenService } from "@/lib/services/token.service";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export interface JwtPayload {
  sub: number; // Cambiado de "id" a "sub" (estándar JWT)
  email: string;
  rol: "ADMIN" | "MEDICO" | "PACIENTE"; // Cambiado de "role" a "rol" para coincidir con backend
  nombre: string;
  exp: number;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  ready: boolean; // indica que ya se intentó cargar el token inicial
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  ready: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicializar token de forma síncrona para evitar parpadeos / redirecciones prematuras
  const initialToken =
    typeof window !== "undefined" ? TokenService.getToken() : null;
  const [token, setToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<JwtPayload | null>(() => {
    if (initialToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(initialToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          TokenService.removeToken();
          return null;
        }
        return decoded;
      } catch {
        TokenService.removeToken();
        return null;
      }
    }
    return null;
  });
  const [ready, setReady] = useState(false);
  const router = useRouter();

  // Validación diferida si no hubo token inicial (por si aparece luego en hidratación)
  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);

  // ✅ Login
  const login = (token: string) => {
    console.log("Logging in with token:", token);
    TokenService.setToken(token);
    const decoded = jwtDecode<JwtPayload>(token);

    setUser(decoded);
    setToken(token);

    // 🚦 Redirección según rol
    const userRole = decoded.rol?.toUpperCase();
    switch (userRole) {
      case "ADMIN":
        router.replace("/admin");
        break;
      case "MEDICO":
        router.replace("/medicos");
        break;
      case "PACIENTE":
        router.replace("/pacientes");
        break;
      default:
        router.replace("/");
    }
  };

  // ✅ Logout
  const logout = () => {
    TokenService.removeToken();
    setUser(null);
    setToken(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
