"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withRoleProtection(
  Component: React.ComponentType,
  allowedRoles: string[]
) {
  return function ProtectedPage(props: React.ComponentProps<typeof Component>) {
    const { token, user, ready } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      // Esperar a que AuthContext termine su carga inicial
      if (!ready) return;

      // Si después de estar ready no hay token => redirigir
      if (!token) {
        router.replace("/login");
        return;
      }

      if (user) {
        const userRole = user.rol?.toUpperCase();
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          router.replace("/");
          setIsAuthorized(false);
        }
      }
    }, [ready, token, user, router]);

    if (!ready || isAuthorized === null) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (!isAuthorized) return null;
    return <Component {...props} />;
  };
}
