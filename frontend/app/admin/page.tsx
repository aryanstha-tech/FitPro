"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { dashboardService } from "@/services/dashboard.service";
import { ApiError } from "@/lib/api-client";
import type { DashboardSummary, RevenuePoint } from "@/types/dashboard";

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .summary()
      .then(setSummary)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load dashboard data."));

    dashboardService.revenue(6).then(setRevenue).catch(() => setRevenue([]));
  }, []);

  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Admin overview</h1>

      {!summary ? (
        <p className="mt-4 text-sm text-ink-muted">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard label="Active members" value={String(summary.activeMembers)} />
          <StatCard label="Orders this month" value={String(summary.ordersThisMonth)} />
          <StatCard
            label="Low stock items"
            value={String(summary.lowStockCount)}
            hint="At or below reorder point"
          />
          <StatCard label="Revenue this month" value={`$${summary.monthRevenue.toLocaleString()}`} />
        </div>
      )}

      <h2 className="mb-3 mt-10 text-sm font-medium text-ink-muted">Revenue, last 6 months</h2>
      {revenue === null ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : revenue.length === 0 ? (
        <p className="text-sm text-ink-muted">No revenue data yet.</p>
      ) : (
        <RevenueChart data={revenue} />
      )}
    </div>
  );
}
