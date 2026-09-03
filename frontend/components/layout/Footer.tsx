import Link from "next/link";
import { Container } from "./Container";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/membership", label: "Membership" },
      { href: "/shop", label: "Shop" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/orders", label: "Order History" },
      { href: "/profile", label: "Profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-base-border bg-base">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-2xl text-ink">
            Fit<span className="text-accent">Pro</span>
          </span>
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Train with purpose. Memberships, coaching and gear built around
            your goals.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-medium text-ink">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-base-border py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-ink-faint md:flex-row">
          <span>&copy; {new Date().getFullYear()} FitPro. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink-muted">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink-muted">
              Terms
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
