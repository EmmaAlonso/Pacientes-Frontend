"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TokenService } from "@/lib/services/token.service";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export interface JwtPayload {
  id: number;
  email: string;
  role: "ADMIN" | "MEDICO" | "PACIENTE";
  nombre: string;
  exp: number;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Cargar token guardado
useEffect(() => {
  const savedToken = TokenService.getToken();
  if (savedToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(savedToken);
      const normalizedUser: JwtPayload = {
        ...decoded,
        role: (decoded as any).rol?.toUpperCase() || (decoded as any).role?.toUpperCase(),
      };
      setUser(normalizedUser);
      setToken(savedToken);
    } catch (err) {
      console.error("Token inválido:", err);
      TokenService.removeToken();
    }
  }
}, []);

  // ✅ Login
  const login = (token: string) => {
    console.log("Logging in with token:", token);
    TokenService.setToken(token);
    const decoded = jwtDecode<JwtPayload>(token);
   const rol = (decoded as any).rol || decoded.role;

const normalizedUser: JwtPayload = {
  ...decoded,
  role: rol ? rol.toUpperCase() : null,
};
    setUser(normalizedUser);
    setToken(token);

    // 🚦 Redirección según rol
    const userRole = normalizedUser.role?.toUpperCase();
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
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
