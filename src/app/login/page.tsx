"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AuthService } from "@/modules/auth/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ApiError } from "@/lib/types/error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin, token: authToken } = useAuth();

  // Si ya hay token, redirigir al inicio
  // Nota: la redirección tras login la realiza AuthContext.login según el rol.
  // Quitamos la redirección automática desde esta página para no sobrescribir
  // la navegación que hace el contexto (router.replace dentro de login()).

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await AuthService.login({ email, password });

      // Use the Auth context to set token + user and handle redirect
      authLogin(response.access_token);
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error al iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
