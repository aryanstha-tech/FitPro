import { Container } from "@/components/layout/Container";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth requiredRole="member">
      <div className="pb-24 pt-32">
        <Container className="flex flex-col gap-10 md:flex-row">
          <DashboardSidebar />
          <div className="flex-1">{children}</div>
        </Container>
      </div>
    </RequireAuth>
  );
}
