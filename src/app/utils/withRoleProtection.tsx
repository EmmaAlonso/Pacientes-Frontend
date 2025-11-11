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
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (!token) {
        router.replace("/login");
        return;
      }

      if (user && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else if (user && !allowedRoles.includes(user.role)) {
        router.replace("/");
      }
    }, [token, user, router]);

    if (!isAuthorized) return null;
    return <Component {...props} />;
  };
}
