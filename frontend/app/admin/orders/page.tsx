"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";

// One place to define how a status looks and what it can turn into next —
// the table, the filter tabs, and the "advance" button all read from these
// two maps instead of repeating status logic in three places.
const STATUS_TONE: Record<Order["status"], "accent" | "warning" | "danger"> = {
  delivered: "accent",
  processing: "warning",
  cancelled: "danger",
};

const NEXT_STATUS: Record<Order["status"], Order["status"] | null> = {
  processing: "delivered",
  delivered: null,
  cancelled: null,
};

type StatusFilter = "all" | Order["status"];

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");

  function loadOrders() {
    orderService
      .listAll()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load orders."));
  }

  useEffect(loadOrders, []);

  async function handleAdvance(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdatingId(order.id);
    try {
      await orderService.updateStatus(order.id, next);
      loadOrders();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update order.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Derived from the orders we already fetched — no separate summary
  // endpoint needed, same approach admin/analytics/page.tsx uses for
  // "Avg. order value" (computed client-side from data already on hand).
  const stats = useMemo(() => {
    const list = orders ?? [];
    const processing = list.filter((o) => o.status === "processing").length;
    const delivered = list.filter((o) => o.status === "delivered").length;
    // Order.total comes from the API as a string (DRF serializes Decimal
    // fields as strings to avoid float rounding) — same pattern as
    // Product.price elsewhere in this codebase.
    const revenue = list.reduce((sum, o) => sum + Number(o.total), 0);
    return { count: list.length, processing, delivered, revenue };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (!orders) return [];
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Orders</h1>

      {orders === null ? (
        <p className="mt-4 text-sm text-ink-muted">Loading...</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <StatCard label="Total orders" value={String(stats.count)} />
            <StatCard label="Processing" value={String(stats.processing)} hint="Awaiting fulfillment" />
            <StatCard label="Delivered" value={String(stats.delivered)} />
            <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
          </div>

          <div className="mt-8 flex gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={
                  filter === value
                    ? "rounded-control bg-accent-muted px-3 py-1.5 text-sm text-accent"
                    : "rounded-control px-3 py-1.5 text-sm text-ink-muted hover:bg-base-raised hover:text-ink"
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {visibleOrders.length === 0 ? (
              <p className="text-sm text-ink-muted">No {filter === "all" ? "" : filter} orders yet.</p>
            ) : (
              <DataTable
                rows={visibleOrders}
                rowKey={(o) => String(o.id)}
                columns={[
                  { header: "Order", render: (o) => `#${o.id}` },
                  { header: "Date", render: (o) => o.date },
                  { header: "Items", render: (o) => <span className="text-ink-muted">{o.items}</span> },
                  { header: "Total", render: (o) => `$${o.total}` },
                  {
                    header: "Status",
                    render: (o) => <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>,
                  },
                  {
                    header: "",
                    render: (o) => {
                      const next = NEXT_STATUS[o.status];
                      if (!next) return null;
                      return (
                        <button
                          onClick={() => handleAdvance(o)}
                          disabled={updatingId === o.id}
                          className="text-sm text-accent hover:underline disabled:opacity-50"
                        >
                          {updatingId === o.id ? "Updating..." : `Mark as ${next}`}
                        </button>
                      );
                    },
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}