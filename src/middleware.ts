import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  nombre: string;
  exp: number;
  iat?: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/login", "/registro"];
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  // Permitir rutas públicas SIN revisar token
  if (isPublic) return NextResponse.next();

  console.log(`[Middleware] Path: ${path}, Token exists: ${!!token}`);

  // Si no hay token, envia al login
  if (!token) {
    console.warn(`[Middleware] No token found, redirecting to login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Decodificación segura
    const payloadBase64 = token.split(".")[1];
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

    const binary = atob(padded);
    const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
    const decodedString = new TextDecoder("utf-8").decode(bytes);
    const decodedJson = JSON.parse(decodedString) as JwtPayload;

    console.log(`[Middleware] Token decoded:`, {
      sub: decodedJson.sub,
      rol: decodedJson.rol,
      exp: decodedJson.exp,
      currentTime: Math.floor(Date.now() / 1000),
    });

    const rol = String(decodedJson.rol || "").toUpperCase();
    const currentTime = Math.floor(Date.now() / 1000);

    // Token expirado
    if (decodedJson.exp && decodedJson.exp < currentTime) {
      console.warn(`[Middleware] Token expirado`);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Redirección home
    if (path === "/") {
      if (rol === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
      if (rol === "MEDICO") return NextResponse.redirect(new URL("/medicos", request.url));
      if (rol === "PACIENTE") return NextResponse.redirect(new URL("/pacientes", request.url));
    }

    // Protección por rol
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
    console.warn("[Middleware] Error decoding token:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Matcher corregido
export const config = {
  matcher: ["/admin/:path*", "/medicos/:path*", "/pacientes/:path*", "/"],
};
