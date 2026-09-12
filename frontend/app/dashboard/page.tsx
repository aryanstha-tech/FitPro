"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { OrderTable } from "@/components/dashboard/OrderTable";
import { authService } from "@/services/auth.service";
import { membershipService } from "@/services/membership.service";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";
import type { CurrentUser } from "@/types/auth";
import type { Membership } from "@/types/membership";
import type { Order as MockOrder } from "@/lib/mock-data";

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(() => authService.getCachedUser());
  const [membership, setMembership] = useState<Membership | "none" | null>(null);
  const [orders, setOrders] = useState<MockOrder[] | null>(null);
  // Tracked separately from `orders` (which is sliced to 3 for the preview
  // table below) so the stat card always shows the real total, not "3".
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load your account."));

    membershipService
      .myMembership()
      .then(setMembership)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setMembership("none");
      });

    orderService
      .myOrders()
      .then((data) => {
        setOrderCount(data.length);
        setOrders(
          data.slice(0, 3).map((o) => ({
            id: String(o.id),
            date: o.date,
            items: o.items,
            total: Number(o.total),
            status: o.status,
          }))
        );
      })
      .catch(() => {
        setOrderCount(0);
        setOrders([]);
      });
  }, []);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!user) return <p className="text-sm text-ink-muted">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Welcome back, {user.name.split(" ")[0]}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Membership"
          value={user.plan ?? "None"}
          hint={user.renewsOn ? `Renews ${user.renewsOn}` : undefined}
        />
        <StatCard label="Member since" value={user.memberSince} />
        <StatCard label="Orders" value={orderCount === null ? "..." : String(orderCount)} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-medium text-ink-muted">Your plan</h2>
          {membership === null && <p className="text-sm text-ink-muted">Loading...</p>}
          {membership === "none" && (
            <p className="text-sm text-ink-muted">
              No active membership.{" "}
              <Link href="/dashboard/membership" className="text-accent hover:underline">
                Choose a plan
              </Link>
              .
            </p>
          )}
          {membership && membership !== "none" && (
            <MembershipCard
              planName={membership.package.name}
              status={membership.status}
              renewsOn={membership.renews_on}
            />
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-muted">Recent orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {orders === null ? (
            <p className="text-sm text-ink-muted">Loading...</p>
          ) : (
            <OrderTable orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}