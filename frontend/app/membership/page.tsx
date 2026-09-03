import { Container } from "@/components/layout/Container";
import { PackageCard } from "@/components/membership/PackageCard";
import { membershipService } from "@/services/membership.service";
import type { Package as MockPackage } from "@/lib/mock-data";

export const metadata = { title: "Membership — FitPro" };
export const dynamic = "force-dynamic"; // live data — don't prerender at build time

export default async function MembershipPage() {
  const packages = await membershipService.listPackages();

  // PackageCard expects the mock-data Package shape (price/id as-authored
  // by the mock layer); adapt the wire shape (price as string, id as
  // number) at the boundary rather than touching the component.
  const adapted: MockPackage[] = packages.map((p) => ({
    id: String(p.id),
    name: p.name,
    price: Number(p.price),
    billing: p.billing,
    featured: p.featured,
    perks: p.perks,
  }));

  return (
    <div className="pb-24 pt-36">
      <Container>
        <div className="max-w-lg">
          <h1 className="text-display-md md:text-display-lg text-ink">Membership packages</h1>
          <p className="mt-4 text-ink-muted">
            Pick the plan that matches how often you train. Switch or cancel
            anytime from your dashboard.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {adapted.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </Container>
    </div>
  );
}
