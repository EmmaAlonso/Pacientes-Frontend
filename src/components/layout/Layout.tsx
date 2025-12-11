"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Stethoscope,
  CalendarDays,
  Menu,
  X,
  LogOut,
  ListCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { TokenService } from "@/lib/services/token.service";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

interface DecodedToken {
  rol?: string;
  nombre?: string;
  email?: string;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = TokenService.getToken();
    if (token) {
      try {
        const decodedRaw = jwtDecode(token as string) as Record<
          string,
          unknown
        >;
        const role = (decodedRaw["rol"] || decodedRaw["role"]) as
          | string
          | undefined;
        const decoded: DecodedToken = {
          rol: role,
          nombre: decodedRaw["nombre"] as string | undefined,
          email: decodedRaw["email"] as string | undefined,
        };
        setUserInfo(decoded);
      } catch (error) {
        console.error("Error al decodificar token:", error);
        TokenService.removeToken();
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    TokenService.removeToken();
    router.push("/login");
  };

  const menuItems = useMemo(() => {
    switch (userInfo?.rol) {
      case "ADMIN":
        return [
          { icon: Home, label: "Inicio", href: "/" },
          { icon: Users, label: "Pacientes", href: "/admin/pacientes" },
          { icon: Stethoscope, label: "Médicos", href: "/admin/medicos" },
          { icon: CalendarDays, label: "Citas", href: "/admin/citas" },
          { icon: ListCheck, label: "Consultas", href: "/admin/consultas" },
        ];
      case "MEDICO":
        return [
          { icon: Home, label: "Inicio", href: "/medicos/pefil" },
          { icon: Users, label: "Mis Pacientes", href: "/medicos/pacientes" },
          { icon: CalendarDays, label: "Mis Citas", href: "/medicos/citas" },
        ];
      case "PACIENTE":
        return [
          { icon: Home, label: "Inicio", href: "/pacientes" },
          { icon: CalendarDays, label: "Mis Citas", href: "/pacientes/citas" },
        ];
      default:
        return [];
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>

          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <span className="font-semibold text-lg text-gray-800">CECOFAM</span>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="Usuario" />
                    <AvatarFallback>
                      {userInfo?.nombre?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">{userInfo?.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {userInfo?.email}
                  </p>
                  <p className="text-[10px] font-semibold uppercase mt-1 text-gray-500">
                    {userInfo?.rol}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 mt-14 w-64 border-r bg-white transition-transform duration-200 ease-in-out shadow-sm",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0"
          )}
        >
          <nav className="h-full px-3 py-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start flex items-center gap-2",
                      isActive && "bg-blue-100 text-blue-600 font-semibold"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN */}
        <main
          className={cn(
            "flex-1 transition-all duration-200 ease-in-out",
            isSidebarOpen ? "md:ml-64" : "md:ml-0"
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
