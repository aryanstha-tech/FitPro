"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { dashboardService } from "@/services/dashboard.service";
import { ApiError } from "@/lib/api-client";
import type { RevenuePoint, MembershipMixEntry } from "@/types/dashboard";

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<RevenuePoint[] | null>(null);
  const [mix, setMix] = useState<MembershipMixEntry[] | null>(null);
  const [avgOrderValue, setAvgOrderValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .revenue(6)
      .then(setRevenue)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load analytics."));

    dashboardService.membershipMix().then(setMix).catch(() => setMix([]));

    // No dedicated "average order value" endpoint in API_CONTRACTS.md yet —
    // computed from the summary endpoint's monthRevenue / ordersThisMonth
    // as a reasonable stand-in until a proper endpoint is added.
    dashboardService
      .summary()
      .then((s) => setAvgOrderValue(s.ordersThisMonth > 0 ? s.monthRevenue / s.ordersThisMonth : 0))
      .catch(() => setAvgOrderValue(0));
  }, []);

  const totalRevenue = revenue?.reduce((sum, m) => sum + m.revenue, 0) ?? 0;
  const growth =
    revenue && revenue.length > 1 && revenue[0].revenue > 0
      ? ((revenue[revenue.length - 1].revenue - revenue[0].revenue) / revenue[0].revenue) * 100
      : 0;

  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Analytics</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue, 6 months" value={`$${totalRevenue.toLocaleString()}`} />
        <StatCard
          label="Avg. order value"
          value={avgOrderValue === null ? "..." : `$${avgOrderValue.toFixed(0)}`}
        />
        <StatCard label="Revenue growth" value={`${growth >= 0 ? "+" : ""}${growth.toFixed(0)}%`} />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-medium text-ink-muted">Monthly revenue</h2>
      {revenue === null ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : (
        <RevenueChart data={revenue} />
      )}

      <h2 className="mb-3 mt-10 text-sm font-medium text-ink-muted">Membership mix</h2>
      {mix === null ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : mix.length === 0 ? (
        <p className="text-sm text-ink-muted">No active memberships yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {mix.map(({ plan, count }) => (
            <div
              key={plan}
              className="rounded-control border border-base-border bg-base-surface px-4 py-2 text-sm"
            >
              <span className="text-ink">{plan}</span>{" "}
              <span className="text-ink-muted">— {count} members</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
