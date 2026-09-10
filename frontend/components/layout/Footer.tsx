"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";

// ── Social icons ───────────────────────────────────────────────────────────
function IconInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/phoenixfitsala/?hl=en", Icon: IconInstagram },
  { label: "Facebook", href: "https://www.facebook.com/phoenixfitshala/", Icon: IconFacebook },
  { label: "TikTok", href: "https://www.tiktok.com/@phoenixfitshala", Icon: IconTikTok },
  { label: "YouTube", href: "https://www.youtube.com/watch?v=aN2sTJ3wOPs&list=RDaN2sTJ3wOPs&start_radio=1", Icon: IconYouTube },
];

const explore = [
  { href: "/about", label: "About FitPro" },
  { href: "/membership", label: "Memberships" },
  { href: "/training", label: "Personal Training" },
  { href: "/shop", label: "Shop" },
];

const account = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

const support = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/contact", label: "Help Center" },
];

// ── Reusable hover-lime link ───────────────────────────────────────────────
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors duration-150 hover:text-accent"
      >
        <span
          aria-hidden="true"
          className="inline-block h-px w-0 bg-accent transition-all duration-200 group-hover:w-3"
          style={{ verticalAlign: "middle" }}
        />
        {children}
      </Link>
    </li>
  );
}

// ── Newsletter strip ───────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div
      className="relative overflow-hidden border-t border-base-border"
      style={{ background: "#0D0F09" }}
    >
      {/* Ambient lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(182,229,9,0.06) 0%, transparent 65%)",
        }}
      />

      <Container className="relative py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Label */}
          <p
            className="font-sans font-semibold uppercase tracking-[0.22em] text-ink-faint"
            style={{ fontSize: "0.67rem" }}
          >
            Stay in the loop
          </p>

          {/* Headline */}
          <h3
            className="font-display uppercase text-white"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.05 }}
          >
            Train Smarter.{" "}
            <span style={{ color: "#B6E509" }}>Live Stronger.</span>
          </h3>

          {/* Body */}
          <p className="max-w-md text-sm text-ink-muted" style={{ lineHeight: 1.75 }}>
            Get weekly training tips, exclusive offers and motivation from FitPro —
            straight to your inbox.
          </p>

          {/* Form */}
          {submitted ? (
            <div
              className="flex items-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold"
              style={{
                background: "rgba(182,229,9,0.10)",
                color: "#B6E509",
                border: "1px solid rgba(182,229,9,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You&apos;re in! Welcome to the FitPro family.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md gap-2"
              id="footer-newsletter-form"
            >
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-pill bg-base-raised px-5 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-all duration-200"
                style={{ border: "1px solid #2A2E23" }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(182,229,9,0.45)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(182,229,9,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid #2A2E23";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                id="footer-newsletter-submit"
                className="flex items-center gap-1.5 rounded-pill px-6 py-3 text-sm font-semibold transition-all duration-200"
                style={{ background: "#B6E509", color: "#0B0D0B" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#C7FA1F";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 16px rgba(182,229,9,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#B6E509";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Join
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Main Footer ────────────────────────────────────────────────────────────
export function Footer() {
  const pathname = usePathname();
  if (pathname === "/register" || pathname === "/login") return null;

  return (
    <footer className="relative overflow-hidden border-t border-base-border bg-base">
      {/* Lime transition glow from CTA → Footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(182,229,9,0.35) 30%, rgba(182,229,9,0.55) 50%, rgba(182,229,9,0.35) 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "60%",
          height: "200px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(182,229,9,0.055) 0%, transparent 65%)",
        }}
      />

      {/* ── Newsletter strip ── */}
      <Newsletter />

      {/* ── Main link grid ── */}
      <div className="border-t border-base-border py-16">
        <Container>
          {/* Brand statement bar above the grid */}
          <div className="mb-12 flex flex-col gap-1 border-b border-base-border pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="font-sans font-semibold uppercase tracking-[0.22em] text-ink-faint"
                style={{ fontSize: "0.67rem" }}
              >
                Our mission
              </p>
              <h4
                className="font-display mt-2 uppercase text-ink"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.1 }}
              >
                Train with purpose.{" "}
                <span style={{ color: "#B6E509" }}>Live with power.</span>
              </h4>
            </div>
            <p className="max-w-xs text-sm text-ink-muted" style={{ lineHeight: 1.75 }}>
              FitPro helps you build strength, confidence and consistency —
              one session at a time.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="grid gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
            {/* Brand column */}
            <div className="flex flex-col gap-5">
              <Link href="/" className="inline-block font-display text-2xl text-ink">
                Fit<span style={{ color: "#B6E509" }}>Pro</span>
              </Link>
              <p className="max-w-xs text-sm text-ink-muted" style={{ lineHeight: 1.8 }}>
                Memberships, coaching and gear —
                <br />
                all built around your goals.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2.5 pt-1">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    id={`footer-social-${label.toLowerCase()}`}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-control text-ink-faint transition-all duration-200"
                    style={{ background: "#15170F", border: "1px solid #2A2E23" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#B6E509";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(182,229,9,0.4)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 12px rgba(182,229,9,0.18)";
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "";
                      (e.currentTarget as HTMLElement).style.borderColor = "#2A2E23";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>

              {/* Contact mini-block */}
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-ink-muted">
                <a
                  href="mailto:hello@fitpro.com"
                  className="transition-colors duration-150 hover:text-accent"
                >
                  hello@fitpro.com
                </a>
                <span>Kathmandu, Nepal</span>
                <span>Sun–Fri - 4AM–8PM</span>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink">
                Explore
              </h4>
              <ul className="flex flex-col gap-3">
                {explore.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink">
                Account
              </h4>
              <ul className="flex flex-col gap-3">
                {account.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink">
                Support
              </h4>
              <ul className="flex flex-col gap-3">
                {support.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-base-border py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-ink-faint md:flex-row">
          <span>&copy; {new Date().getFullYear()} FITPRO. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors duration-150 hover:text-ink-muted">Privacy</Link>
            <Link href="/terms" className="transition-colors duration-150 hover:text-ink-muted">Terms</Link>
            <Link href="/cookies" className="transition-colors duration-150 hover:text-ink-muted">Cookies</Link>
          </div>
        </Container>
      </div>

      {/* ── Giant background wordmark ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center select-none overflow-hidden"
        style={{ lineHeight: 0.85 }}
      >
        <span
          className="font-display"
          style={{
            fontSize: "clamp(6rem, 20vw, 18rem)",
            fontWeight: 900,
            color: "rgba(182,229,9,0.028)",
            letterSpacing: "0.15em",
          }}
        >
          FITPRO
        </span>
      </div>
    </footer>
  );
}
