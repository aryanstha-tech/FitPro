"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";

type OrderFilter =
  | "all"
  | "pending_payment"
  | "processing"
  | "completed"
  | "delivered"
  | "cancelled";

const STATUS_TONE: Record<
  Order["status"],
  "accent" | "warning" | "danger"
> = {
  pending_payment: "warning",
  processing: "warning",
  completed: "accent",
  delivered: "accent",
  cancelled: "danger",
};

const STATUS_LABEL: Record<Order["status"], string> = {
  pending_payment: "Pending Payment",
  processing: "Processing",
  completed: "Completed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const FILTERS: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending_payment", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    orderService
      .listAll()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : "Couldn't load orders."
        )
      );
  }, []);

  const stats = useMemo(() => {
    const list = orders ?? [];

    return {
      total: list.length,
      pending: list.filter(
        (order) => order.status === "pending_payment"
      ).length,
      processing: list.filter(
        (order) => order.status === "processing"
      ).length,
      delivered: list.filter(
        (order) => order.status === "delivered"
      ).length,
    };
  }, [orders]);

  const visible = useMemo(() => {
    if (!orders) return [];

    if (filter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  async function markAsDelivered(order: Order) {
    setUpdatingId(order.id);
    setError(null);

    try {
      const updatedOrder = await orderService.updateStatus(
        order.id,
        "delivered"
      );

      setOrders((current) =>
        current
          ? current.map((item) =>
              item.id === updatedOrder.id
                ? updatedOrder
                : item
            )
          : current
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't update the order."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (error && orders === null) {
    return (
      <p className="text-sm text-red-400">
        {error}
      </p>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-display-md text-ink">
          Orders
        </h1>

        <p className="mt-2 text-sm text-ink-muted">
          Manage customer orders and fulfillment.
        </p>
      </div>

      {orders === null ? (
        <p className="mt-8 text-sm text-ink-muted">
          Loading orders...
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total Orders"
              value={String(stats.total)}
            />

            <StatCard
              label="Pending"
              value={String(stats.pending)}
            />

            <StatCard
              label="Processing"
              value={String(stats.processing)}
            />

            <StatCard
              label="Delivered"
              value={String(stats.delivered)}
            />
          </div>

          {error && (
            <div className="mt-6 rounded-control border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={
                  filter === value
                    ? "rounded-control bg-accent-muted px-3 py-1.5 text-sm text-accent"
                    : "rounded-control px-3 py-1.5 text-sm text-ink-muted transition hover:bg-base-raised hover:text-ink"
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {visible.length === 0 ? (
              <div className="rounded-card border border-border-subtle bg-base-raised px-6 py-12 text-center">
                <p className="text-sm text-ink-muted">
                  No orders found.
                </p>
              </div>
            ) : (
              <DataTable
                rows={visible}
                rowKey={(order) => String(order.id)}
                columns={[
                  {
                    header: "Order",
                    render: (order) => (
                      <span className="font-medium text-ink">
                        #{order.id}
                      </span>
                    ),
                  },

                  {
                    header: "Customer",
                    render: (order) => (
                      <div>
                        <div className="text-ink">
                          {order.customerName || "—"}
                        </div>

                        <div className="text-xs text-ink-faint">
                          {order.customerEmail || "—"}
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: "Items",
                    render: (order) => (
                      <span className="text-ink-muted">
                        {order.packageName
                          ? `${order.packageName} membership`
                          : order.items}
                      </span>
                    ),
                  },

                  {
                    header: "Amount",
                    render: (order) => (
                      <span className="font-medium text-ink">
                        ${order.total}
                      </span>
                    ),
                  },

                  {
                    header: "Status",
                    render: (order) => (
                      <Badge tone={STATUS_TONE[order.status]}>
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    ),
                  },

                  {
                    header: "Date",
                    render: (order) => (
                      <span className="text-ink-muted">
                        {order.date}
                      </span>
                    ),
                  },

                  {
                    header: "Action",
                    render: (order) =>
                      order.status === "processing" ? (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() =>
                            markAsDelivered(order)
                          }
                          className="rounded-control bg-accent px-3 py-1.5 text-sm font-medium text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Updating..."
                            : "Mark as Delivered"}
                        </button>
                      ) : order.status === "delivered" ? (
                        <span className="text-xs text-ink-faint">
                          Delivered
                        </span>
                      ) : (
                        <span className="text-xs text-ink-faint">
                          —
                        </span>
                      ),
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