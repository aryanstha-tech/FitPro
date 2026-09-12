"use client";

import { useEffect, useState } from "react";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { PackageCard } from "@/components/membership/PackageCard";
import { membershipService } from "@/services/membership.service";
import { useSwitchPlan } from "@/lib/use-switch-plan";
import { ApiError } from "@/lib/api-client";
import type { Membership } from "@/types/membership";
import type { Package as MockPackage } from "@/lib/mock-data";

export default function MembershipDetailsPage() {
  const [membership, setMembership] = useState<Membership | "none" | null>(null);
  const [otherPlans, setOtherPlans] = useState<MockPackage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); // true while cancel/renew is in flight

  function loadMembership() {
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
  }

  const { switchPlan, switchingId, error: switchError } = useSwitchPlan(loadMembership);

  useEffect(() => {
    loadMembership();

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

  async function handleCancel() {
    setError(null);
    setBusy(true);
    try {
      await membershipService.cancel();
      loadMembership(); // status flips to "expiring" — MembershipCard reflects it immediately
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't cancel membership.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRenew() {
    setError(null);
    setBusy(true);
    try {
      await membershipService.renew();
      loadMembership();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't renew membership.");
    } finally {
      setBusy(false);
    }
  }

  const currentPlanName = membership && membership !== "none" ? membership.package.name : null;
  const switchablePlans = otherPlans?.filter((p) => p.name !== currentPlanName) ?? null;

  return (
    <div>
      <h1 className="text-display-md text-ink">Membership</h1>

      {(error || switchError) && <p className="mt-4 text-sm text-red-400">{error ?? switchError}</p>}

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
            onCancel={handleCancel}
            onRenew={handleRenew}
            busy={busy}
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
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onChoose={() => switchPlan(pkg.id)}
              loading={switchingId === pkg.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}