"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Package, User } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/orders", label: "Order History", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-base-border pb-4 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:pb-0 md:pr-6">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-control px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-accent-muted text-accent"
                : "text-ink-muted hover:bg-base-raised hover:text-ink"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
