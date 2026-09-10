"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Tag, ShoppingBag, Package, Boxes, UserCog, BarChart3 } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/memberships", label: "Memberships", icon: Users },
  { href: "/admin/packages", label: "Packages", icon: Tag },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
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