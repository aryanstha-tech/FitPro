"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";

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

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

  return (
    <div>
      <h1 className="text-display-md text-ink">Orders</h1>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {orders === null && !error ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <DataTable
            rows={orders ?? []}
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
    </div>
  );
}