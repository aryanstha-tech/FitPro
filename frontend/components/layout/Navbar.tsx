"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Container } from "./Container";
import { Button } from "../ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/register") return null;

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
          </Link>
          <Button href="/register" size="sm" className="hidden sm:inline-flex">
            Join Now
          </Button>
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
              <Button size="sm" href="/register" className="ml-auto">
                Join Now
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
