"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

import { TokenService } from "@/lib/services/token.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Menu,
  X,
  Home,
  Users,
  CalendarDays,
  Stethoscope,
  Bell,
  LogOut,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

interface MedicoDecodedToken {
  rol: string;
  nombre?: string;
  email?: string;
  id?: number;
}

export default function MedicosLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState<MedicoDecodedToken | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // 🔐 Validación del token
  useEffect(() => {
    const token = TokenService.getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decodedRaw = jwtDecode(token as string) as Record<string, unknown>;
      const role = (decodedRaw["rol"] || decodedRaw["role"]) as
        | string
        | undefined;
      if ((role || "").toUpperCase() !== "MEDICO") {
        router.push("/");
        return;
      }
      const decoded: MedicoDecodedToken = {
        rol: role || "MEDICO",
        nombre: decodedRaw["nombre"] as string | undefined,
        email: decodedRaw["email"] as string | undefined,
        id: decodedRaw["id"] as number | undefined,
      };
      setUserInfo(decoded);
    } catch (error) {
      console.error(error);
      TokenService.removeToken();
      router.push("/login");
    }
  }, [router]);

  const menuItems = useMemo(
    () => [
      { icon: Home, label: "Inicio", href: "/medicos" },
      { icon: Users, label: "Pacientes", href: "/medicos/pacientes" },
      { icon: CalendarDays, label: "Citas", href: "/medicos/citas" },
      { icon: Stethoscope, label: "Consultas", href: "/medicos/consultas" },
    ],
    []
  );

  const logout = () => {
    TokenService.removeToken();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Botón mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="h-9"
            />
            <span className="font-semibold text-lg">CECOFAM </span>
          </div>

          {/* Notificaciones y Perfil */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/doctor.png" />
                <AvatarFallback>
                  {userInfo?.nombre?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userInfo?.nombre}</span>
            </div>

            <Button variant="ghost" className="text-red-600" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-30 mt-14 w-64 bg-white border-r shadow-sm transition-transform duration-200 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0`}
        >
          <nav className="px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={`w-full flex justify-start gap-2 ${
                      active ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={`flex-1 p-6 md:ml-64 transition-all`}>{children}</main>
      </div>
    </div>
  );
}
