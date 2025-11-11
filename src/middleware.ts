import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  nombre: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/registro"];
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  // Si no hay token y la ruta no es pública, redirige al login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // Decodificamos el token (compatible con entorno Edge)
      const payloadBase64 = token.split(".")[1];
      const decodedString = Buffer.from(payloadBase64, "base64").toString("utf8");
      const decodedJson = JSON.parse(decodedString) as JwtPayload;

      const rol = decodedJson.rol?.toUpperCase();
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificamos si el token ha expirado
      if (decodedJson.exp && decodedJson.exp < currentTime) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      // Redirecciones según rol
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
      console.error("Error al decodificar el token:", error);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Aplicamos el middleware a todas las rutas excepto los recursos estáticos
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
