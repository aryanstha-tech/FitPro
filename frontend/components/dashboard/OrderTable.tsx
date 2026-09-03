import { Badge } from "../ui/Badge";
import type { Order } from "@/lib/mock-data";

const statusTone = {
  delivered: "accent",
  processing: "warning",
  cancelled: "danger",
} as const;

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-base-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-base-border text-ink-muted">
            <th className="px-5 py-3 font-medium">Order</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Items</th>
            <th className="px-5 py-3 font-medium">Total</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-base-border last:border-0">
              <td className="px-5 py-4 text-ink">{order.id}</td>
              <td className="px-5 py-4 text-ink-muted">{order.date}</td>
              <td className="px-5 py-4 text-ink-muted">{order.items}</td>
              <td className="px-5 py-4 text-ink">${order.total}</td>
              <td className="px-5 py-4">
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
