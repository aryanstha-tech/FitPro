"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { authService } from "@/services/auth.service";

// RequireAuth's "member" tier deliberately also admits staff/admin (it's a
// general-purpose auth check, not a member-only one) — so a second, more
// specific check is needed here: staff/admin should never actually SEE the
// member dashboard/purchase flow, even if they're authenticated for it.
function MemberOnlyGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = authService.getCachedUser();
    if (user && (user.role === "staff" || user.role === "admin")) {
      router.replace("/admin");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth requiredRole="member">
      <MemberOnlyGate>
        <div className="pb-24 pt-32">
          <Container className="flex flex-col gap-10 md:flex-row">
            <DashboardSidebar />
            <div className="flex-1">{children}</div>
          </Container>
        </div>
      </MemberOnlyGate>
    </RequireAuth>
  );
}