"use client";

import { useEffect, useState } from "react";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { PackageCard } from "@/components/membership/PackageCard";
import { membershipService } from "@/services/membership.service";
import { ApiError } from "@/lib/api-client";
import type { Membership } from "@/types/membership";
import type { Package as MockPackage } from "@/lib/mock-data";

export default function MembershipDetailsPage() {
  const [membership, setMembership] = useState<Membership | "none" | null>(null);
  const [otherPlans, setOtherPlans] = useState<MockPackage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    membershipService
      .myMembership()
      .then(setMembership)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setMembership("none");
        } else {
          setError(err instanceof ApiError ? err.message : "Couldn't load membership.");
        }
      });

    membershipService
      .listPackages()
      .then((packages) => {
        setOtherPlans(
          packages.map((p) => ({
            id: String(p.id),
            name: p.name,
            price: Number(p.price),
            billing: p.billing,
            featured: p.featured,
            perks: p.perks,
          }))
        );
      })
      .catch(() => setOtherPlans([]));
  }, []);

  const currentPlanName = membership && membership !== "none" ? membership.package.name : null;
  const switchablePlans = otherPlans?.filter((p) => p.name !== currentPlanName) ?? null;

  return (
    <div>
      <h1 className="text-display-md text-ink">Membership</h1>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {membership === null && !error && (
        <p className="mt-4 text-sm text-ink-muted">Loading membership...</p>
      )}

      {membership === "none" && (
        <p className="mt-4 text-sm text-ink-muted">
          No active membership yet — choose a plan below to get started.
        </p>
      )}

      {membership && membership !== "none" && (
        <div className="mt-8 max-w-md">
          <MembershipCard
            planName={membership.package.name}
            status={membership.status}
            renewsOn={membership.renews_on}
          />
        </div>
      )}

      <h2 className="mb-4 mt-12 text-sm font-medium text-ink-muted">
        {membership === "none" ? "Choose a plan" : "Switch plan"}
      </h2>
      {switchablePlans === null ? (
        <p className="text-sm text-ink-muted">Loading plans...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {switchablePlans.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
