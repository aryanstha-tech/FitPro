"use client";

import { useEffect, useState } from "react";
import { OrderTable } from "@/components/dashboard/OrderTable";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";
import type { Order as MockOrder } from "@/lib/mock-data";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .myOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load orders."));
  }, []);

  // OrderTable expects the mock-data Order shape (total as a number,
  // id as a string) — adapt the wire shape at the boundary.
  const adapted: MockOrder[] | null =
    orders?.map((o) => ({
      id: String(o.id),
      date: o.date,
      items: o.items,
      total: Number(o.total),
      status: o.status,
    })) ?? null;

  return (
    <div>
      <h1 className="text-display-md text-ink">Order history</h1>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!error && !adapted && <p className="mt-4 text-sm text-ink-muted">Loading orders...</p>}
      {adapted && (
        <>
          <p className="mt-2 text-sm text-ink-muted">{adapted.length} orders</p>
          <div className="mt-8">
            <OrderTable orders={adapted} />
          </div>
        </>
      )}
    </div>
  );
}
