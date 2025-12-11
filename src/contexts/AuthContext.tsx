"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenService } from "@/lib/services/token.service";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export interface JwtPayload {
  sub: number;
  email: string;
  rol?: "ADMIN" | "MEDICO" | "PACIENTE" | string;
  role?: string;
  nombre: string;
  exp: number;
  medicoId?: number | null;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  ready: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  ready: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialToken =
    typeof window !== "undefined" ? TokenService.getToken() : null;
  const [token, setToken] = useState<string | null>(initialToken);

  const [user, setUser] = useState<JwtPayload | null>(() => {
    if (!initialToken) return null;
    try {
      const decodedRaw = jwtDecode(initialToken as string) as
        | JwtPayload
        | Record<string, unknown>;
      // normalize role claim (accept 'rol' or 'role')
      const dr = decodedRaw as Record<string, unknown>;
      const normalized = {
        ...(decodedRaw as object),
        rol: (dr["rol"] || dr["role"]) as string | undefined,
      } as JwtPayload;

      // token expirado?
      if (normalized.exp && normalized.exp * 1000 < Date.now()) {
        TokenService.removeToken();
        return null;
      }
      // Guardar medicoId en localStorage para compatibilidad con código existente
      if (typeof window !== "undefined" && normalized.medicoId) {
        localStorage.setItem("medicoId", String(normalized.medicoId));
      }
      return normalized;
    } catch {
      TokenService.removeToken();
      return null;
    }
  });

  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);

  const login = (tokenStr: string) => {
    TokenService.setToken(tokenStr);
    setToken(tokenStr);
    try {
      const decodedRaw = jwtDecode(tokenStr) as
        | JwtPayload
        | Record<string, unknown>;
      const dr2 = decodedRaw as Record<string, unknown>;
      const decoded = {
        ...(decodedRaw as object),
        rol: (dr2["rol"] || dr2["role"]) as string | undefined,
      } as JwtPayload;
      setUser(decoded);

      // GUARDA medicoId explícitamente en localStorage (para tus páginas)
      if (decoded.medicoId) {
        localStorage.setItem("medicoId", String(decoded.medicoId));
      } else {
        localStorage.removeItem("medicoId");
      }

      // redirección por rol
      const userRole = (decoded.rol || decoded.role || "").toUpperCase();
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
    } catch (err) {
      console.error("Error decodificando token en login:", err);
    }
  };

  const logout = () => {
    TokenService.removeToken();
    localStorage.removeItem("medicoId");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
