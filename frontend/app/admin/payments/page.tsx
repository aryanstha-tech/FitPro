"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";

// A payment-specific view of Order.status — collapses the fulfillment
// stages (processing/completed/delivered) into one "Paid" bucket, since
// none of that distinction matters for a payments ledger. Order.status is
// only ever set to "cancelled" by verify_order_payment()'s failure
// branch (payment didn't complete) — there's no admin action that
// cancels an already-paid order — so "cancelled" here reliably means a
// failed/incomplete payment, not an order-management decision. This is
// a DERIVED status, not a separate stored field, so it can never drift
// out of sync with the order itself.
type PaymentStatus = "awaiting" | "paid" | "failed";

function paymentStatusFor(order: Order): PaymentStatus {
  if (!order.paymentStatus || order.paymentStatus === "pending") return "awaiting";
  if (order.paymentStatus === "failed") return "failed";
  return "paid";
}

const PAYMENT_STATUS_TONE: Record<PaymentStatus, "accent" | "warning" | "danger"> = {
  awaiting: "warning",
  paid: "accent",
  failed: "danger",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  awaiting: "Awaiting",
  paid: "Paid",
  failed: "Failed",
};

function methodFor(order: Order): string {
  if (!order.paymentMethod) return "—";
  return order.paymentMethod === "khalti" ? "Khalti" : "Test (Mock)";
}

type Filter = "all" | PaymentStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "awaiting", label: "Awaiting" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
];

export default function PaymentsPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    orderService
      .listAll()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load payments."));
  }, []);

  const stats = useMemo(() => {
    const list = orders ?? [];
    const paid = list.filter((o) => paymentStatusFor(o) === "paid");
    const awaiting = list.filter((o) => paymentStatusFor(o) === "awaiting").length;
    const failed = list.filter((o) => paymentStatusFor(o) === "failed").length;
    const collected = paid.reduce((sum, o) => sum + Number(o.total), 0);
    return { collected, paidCount: paid.length, awaiting, failed };
  }, [orders]);

  const visible = useMemo(() => {
    if (!orders) return [];
    if (filter === "all") return orders;
    return orders.filter((o) => paymentStatusFor(o) === filter);
  }, [orders, filter]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Payments</h1>

      {orders === null ? (
        <p className="mt-4 text-sm text-ink-muted">Loading...</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Collected" value={`$${stats.collected.toLocaleString()}`} />
            <StatCard label="Paid" value={String(stats.paidCount)} />
            <StatCard label="Awaiting" value={String(stats.awaiting)} />
            <StatCard label="Failed" value={String(stats.failed)} />
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
            {visible.length === 0 ? (
              <p className="text-sm text-ink-muted">No payments here yet.</p>
            ) : (
              <DataTable
                rows={visible}
                rowKey={(o) => String(o.id)}
                columns={[
                  { header: "Order", render: (o) => `#${o.id}` },
                  {
                    header: "Customer",
                    render: (o) => (
                      <div>
                        <div className="text-ink">{o.customerName}</div>
                        <div className="text-xs text-ink-faint">{o.customerEmail}</div>
                      </div>
                    ),
                  },
                  {
                    header: "For",
                    render: (o) => (
                      <span className="text-ink-muted">
                        {o.packageName ? `${o.packageName} membership` : o.items}
                      </span>
                    ),
                  },
                  { header: "Amount", render: (o) => `$${o.total}` },
                  { header: "Method", render: (o) => <span className="text-ink-muted">{methodFor(o)}</span> },
                  {
                    header: "Reference",
                    render: (o) => (
                      <span className="font-mono text-xs text-ink-faint">{o.paymentReference ?? "—"}</span>
                    ),
                  },
                  {
                    header: "Status",
                    render: (o) => {
                      const s = paymentStatusFor(o);
                      return <Badge tone={PAYMENT_STATUS_TONE[s]}>{PAYMENT_STATUS_LABEL[s]}</Badge>;
                    },
                  },
                  { header: "Date", render: (o) => <span className="text-ink-muted">{o.date}</span> },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}