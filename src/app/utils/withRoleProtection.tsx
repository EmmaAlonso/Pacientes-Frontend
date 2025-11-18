"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withRoleProtection(
  Component: React.ComponentType,
  allowedRoles: string[]
) {
  return function ProtectedPage(props: any) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      if (!token) {
        console.log (token)
        router.replace("/login");

        return;
      }

      if (user) {
        const userRole = user.role?.toUpperCase();
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          router.replace("/");
          setIsAuthorized(false);
        }
      }
    }, [token, user, router]);

    if (isAuthorized === null) {
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
