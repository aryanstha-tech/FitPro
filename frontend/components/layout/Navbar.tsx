"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, LogOut } from "lucide-react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Container } from "./Container";
import { Button } from "../ui/Button";
import { useCart } from "@/lib/cart-context";
import { authService } from "@/services/auth.service";
import type { CurrentUser } from "@/types/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const [user, setUser] = useState<CurrentUser | null>(null);

  // Navbar lives in the root layout, so it never unmounts between page
  // navigations — re-reading the cached user on every pathname change
  // (rather than once on mount) is what keeps it in sync after a login,
  // register, or logout redirect, without needing a global auth context.
  useEffect(() => {
    setUser(authService.getCachedUser());
  }, [pathname]);

  function handleLogout() {
    authService.logout();
    setUser(null);
    router.push("/login");
  }

  if (pathname === "/register" || pathname === "/login") return null;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="/fitpro-logo.png"
            alt="FitPro"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={clsx(
                  "relative text-sm transition-colors",
                  active
                    ? "text-accent after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-accent"
                    : "text-ink hover:text-accent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden text-ink hover:text-accent sm:block">
            <Search size={18} />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-base transition-transform hover:scale-105"
          >
            <Icon icon="el:shopping-cart" width="18" height="18" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-base">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Button href={user.role === "member" ? "/dashboard" : "/admin"} variant="ghost" size="sm">
                {user.role === "member" ? "Dashboard" : "Admin"}
              </Button>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          ) : (
            <Button href="/register" size="sm" className="hidden sm:inline-flex">
              Join Now
            </Button>
          )}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-ink md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-base-border bg-base md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-control px-3 py-2.5 text-sm",
                  pathname === link.href ? "text-accent" : "text-ink hover:bg-base-raised"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-4 border-t border-base-border px-3 pt-4">
              <button aria-label="Search" className="text-ink hover:text-accent">
                <Search size={18} />
              </button>
              <Link
                href="/cart"
                aria-label="Cart"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-base transition-transform hover:scale-105"
              >
                <Icon icon="el:shopping-cart" width="18" height="18" />
              </Link>
              {user ? (
                <div className="ml-auto flex items-center gap-3">
                  <Link
                    href={user.role === "member" ? "/dashboard" : "/admin"}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {user.role === "member" ? "Dashboard" : "Admin"}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="text-sm text-ink-muted hover:text-ink"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Button size="sm" href="/register" className="ml-auto">
                  Join Now
                </Button>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}