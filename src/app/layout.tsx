import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner"; // ✅ Importa el componente para los toasts

export const metadata: Metadata = {
  title: "Sys Cecofam",
  description: "Sistema de gestión de pacientes y médicos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}

          {/* ✅ Toaster global para mostrar mensajes de éxito o error */}
          <Toaster
            position="top-right"
            richColors
            expand
            toastOptions={{
              style: {
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "0.95rem",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
