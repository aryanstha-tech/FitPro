"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

type RequiredRole = "member" | "staff"; // "staff" also admits admin

interface RequireAuthProps {
  children: ReactNode;
  requiredRole?: RequiredRole;
}

function roleSatisfies(role: string, required: RequiredRole): boolean {
  if (required === "member") return true; // any authenticated role
  return role === "staff" || role === "admin";
}

/**
 * Route guard for everything under /dashboard and /admin.
 *
 * Auth is JWT-in-localStorage (see auth.service.ts), which a server
 * component can't read — so this check has to happen client-side. To
 * avoid a flash of protected content, it first checks the cached user
 * from login/register synchronously, then re-verifies against
 * /auth/me/ in the background and signs out if the server disagrees
 * (e.g. a revoked token or a role that changed since last login).
 */
export function RequireAuth({ children, requiredRole = "member" }: RequireAuthProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const cached = authService.getCachedUser();
    if (cached && !roleSatisfies(cached.role, requiredRole)) {
      router.replace("/dashboard");
      return;
    }

    setChecked(true);

    authService
      .me()
      .then((user) => {
        if (!roleSatisfies(user.role, requiredRole)) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        authService.logout();
        router.replace("/login");
      });
  }, [router, requiredRole]);

  if (!checked) return null;
  return <>{children}</>;
}
