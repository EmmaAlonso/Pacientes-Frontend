import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  sub: number; // Cambiado de "id" a "sub" para coincidir con el estándar JWT
  email: string;
  rol: string;
  nombre: string;
  exp: number;
  iat?: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Removemos '/' de rutas públicas para que pueda redirigir según rol
  const publicPaths = ["/login", "/registro"];
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  // Debug: Log para ver si hay token
  if (!isPublic) {
    console.log(`[Middleware] Path: ${path}, Token exists: ${!!token}`);
  }

  // Si no hay token y la ruta no es pública, redirige al login
  if (!token && !isPublic) {
    console.warn(
      `[Middleware] No token found, redirecting to login from ${path}`
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // Decodificamos el token (compatible con entorno Edge / workers)
      const payloadBase64 = token.split(".")[1];

      // base64url -> base64
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      // Añadir padding si hace falta
      const pad = base64.length % 4;
      const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

      // Decodificación robusta UTF-8 usando TextDecoder
      const binary = atob(padded);
      const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
      const decodedString = new TextDecoder("utf-8").decode(bytes);
      const decodedJson = JSON.parse(decodedString) as JwtPayload;

      // Debug: Log del token decodificado
      console.log(`[Middleware] Token decoded:`, {
        sub: decodedJson.sub,
        rol: decodedJson.rol,
        exp: decodedJson.exp,
        currentTime: Math.floor(Date.now() / 1000),
      });

      const rol = String(decodedJson.rol || "").toUpperCase();
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificamos si el token ha expirado
      if (decodedJson.exp && decodedJson.exp < currentTime) {
        console.warn(
          `[Middleware] Token expirado. Exp: ${decodedJson.exp}, Current: ${currentTime}`
        );
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      // Auto-redirección desde raíz según rol
      if (path === "/") {
        if (rol === "ADMIN")
          return NextResponse.redirect(new URL("/admin", request.url));
        if (rol === "MEDICO")
          return NextResponse.redirect(new URL("/medicos", request.url));
        if (rol === "PACIENTE")
          return NextResponse.redirect(new URL("/pacientes", request.url));
      }

      // Redirecciones según rol para accesos directos
      if (path.startsWith("/admin") && rol !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (path.startsWith("/medicos") && rol !== "MEDICO") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (path.startsWith("/pacientes") && rol !== "PACIENTE") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      // Si existe token pero falla la decodificación, no forzamos logout.
      // Permitimos que el cliente maneje la navegación y estado.
      console.warn(
        "[Middleware] Error al decodificar el token, permitiendo paso:",
        error
      );
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Aplicamos el middleware a todas las rutas excepto los recursos estáticos
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
