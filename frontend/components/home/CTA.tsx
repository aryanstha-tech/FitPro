"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "../layout/Container";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax glow on mouse move
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      section.style.setProperty("--mx", `${x}%`);
      section.style.setProperty("--my", `${y}%`);
    };
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta-section"
      className="relative overflow-hidden border-t border-base-border"
      style={{
        background: "#0B0D0B",
        "--mx": "50%",
        "--my": "50%",
      } as React.CSSProperties}
    >
      {/* Lime radial glow that follows the mouse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at var(--mx) var(--my), rgba(182,229,9,0.065) 0%, transparent 70%)",
          transition: "background 0.1s ease",
        }}
      />

      {/* Static ambient lime glow — bottom-centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "80%",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(182,229,9,0.45), transparent)",
          filter: "blur(1px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "50%",
          height: "120px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(182,229,9,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Giant ghost text behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display"
          style={{
            fontSize: "clamp(5rem, 18vw, 16rem)",
            fontWeight: 900,
            color: "rgba(182,229,9,0.022)",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
          }}
        >
          PURPOSE
        </span>
      </div>

      <Container className="relative z-10 py-28 lg:py-36">
        {/* Pre-label */}
        <p
          className="font-sans font-semibold uppercase tracking-[0.25em] text-accent"
          style={{ fontSize: "0.7rem" }}
        >
          Ready to begin
        </p>

        {/* Main headline — dramatic two-liner */}
        <h2
          className="font-display mt-5 uppercase leading-none text-ink"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            letterSpacing: "-0.01em",
          }}
        >
          Don&apos;t just train.
          <br />
          <span
            style={{
              WebkitTextStroke: "1.5px rgba(182,229,9,0.85)",
              color: "transparent",
            }}
          >
            Train with purpose.
          </span>
        </h2>

        {/* Sub-headline */}
        <p
          className="mt-6 max-w-xl font-sans text-ink-muted"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.65 }}
        >
          Train smarter.&nbsp; Move better.&nbsp; Become stronger.
          <br />
          Join FitPro today and get your{" "}
          <span className="text-ink font-medium">
            first personal training session on us.
          </span>
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            id="cta-start-journey"
            className="group inline-flex items-center gap-3 rounded-pill px-8 py-4 font-sans font-semibold transition-all duration-300"
            style={{
              background: "#B6E509",
              color: "#0B0D0B",
              fontSize: "1rem",
              boxShadow: "0 0 0 0 rgba(182,229,9,0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#C7FA1F";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 28px rgba(182,229,9,0.45), 0 0 60px rgba(182,229,9,0.15)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#B6E509";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 0 rgba(182,229,9,0)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
          >
            Start Your Journey
            {/* Arrow with slide animation */}
            <span
              className="inline-flex transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            href="/membership"
            id="cta-view-plans"
            className="inline-flex items-center gap-2 rounded-pill border px-8 py-4 font-sans text-sm font-medium text-ink-muted transition-all duration-200 hover:border-accent/40 hover:text-ink"
            style={{ borderColor: "#2A2E23", fontSize: "1rem" }}
          >
            View Plans
          </Link>
        </div>

        {/* Social proof micro-stat row */}
        <div className="mt-12 flex flex-wrap items-center gap-8">
          {[
            { value: "2,400+", label: "Active Members" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "12+", label: "Expert Coaches" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span
                className="font-display text-ink"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                {value}
              </span>
              <span
                className="font-sans text-ink-faint uppercase tracking-widest"
                style={{ fontSize: "0.62rem" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
