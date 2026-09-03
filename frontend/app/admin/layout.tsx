import { Container } from "@/components/layout/Container";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth requiredRole="staff">
      <div className="pb-24 pt-32">
        <Container className="flex flex-col gap-10 md:flex-row">
          <AdminSidebar />
          <div className="flex-1">{children}</div>
        </Container>
      </div>
    </RequireAuth>
  );
}
