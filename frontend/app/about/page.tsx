"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  Dumbbell,
  Users,
  Shield,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Heart,
  TrendingUp,
} from "lucide-react";

// ─── GALLERY CATEGORIES ───────────────────────────────────────────────────────
// To add your real gym photos:
//   1. Place your images in /public/gallery/  (create the folder if needed)
//   2. Find the category that best fits each photo
//   3. Replace `src: null` with `src: "/gallery/your-filename.jpg"`
//      and set `isPlaceholder: false`
// ─────────────────────────────────────────────────────────────────────────────

const galleryCategories = [
  {
    id: "training-floor",
    label: "TRAINING FLOOR",
    title: "The Main Floor",
    description:
      "A spacious, purpose-built environment designed for focused, high-performance training.",
    featured: {
      src: "/gym-floor.webp",
      alt: "FitPro main training floor",
      isPlaceholder: false,
    },
    secondary: [
      {
        src: "/hero-gym.png",
        alt: "FitPro strength training area",
        isPlaceholder: false,
      },
      {
        src: null,
        alt: "Training floor overview — add your photo here",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "heavy-lifting",
    label: "HEAVY LIFTING",
    title: "Strength Zone",
    description:
      "Racks, barbells, benches and every plate you'll ever need. Built for serious lifters.",
    featured: {
      src: null,
      alt: "FitPro strength zone — add your photo here",
      isPlaceholder: true,
    },
    secondary: [
      {
        src: null,
        alt: "Free weights area — add your photo here",
        isPlaceholder: true,
      },
      {
        src: null,
        alt: "Power rack area — add your photo here",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "cardio-zone",
    label: "CARDIO ZONE",
    title: "Cardio & Conditioning",
    description:
      "Treadmills, rowers, bikes and assault equipment for endurance and conditioning work.",
    featured: {
      src: null,
      alt: "FitPro cardio zone — add your photo here",
      isPlaceholder: true,
    },
    secondary: [
      {
        src: null,
        alt: "Cardio equipment — add your photo here",
        isPlaceholder: true,
      },
      {
        src: null,
        alt: "Conditioning area — add your photo here",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "functional-training",
    label: "FUNCTIONAL TRAINING",
    title: "Functional Zone",
    description:
      "Open floor space for kettlebells, sleds, battle ropes and functional movement patterns.",
    featured: {
      src: null,
      alt: "FitPro functional training area — add your photo here",
      isPlaceholder: true,
    },
    secondary: [
      {
        src: null,
        alt: "Functional equipment — add your photo here",
        isPlaceholder: true,
      },
      {
        src: null,
        alt: "Open training space — add your photo here",
        isPlaceholder: true,
      },
    ],
  },
];

const experienceFeatures = [
  {
    icon: Target,
    title: "COACHED, NOT JUST EQUIPPED",
    description:
      "Every new member gets a personal check-in with a coach. We make sure you know the space, the equipment, and have a plan before your first real session.",
  },
  {
    icon: Dumbbell,
    title: "QUALITY EQUIPMENT",
    description:
      "Serious equipment for strength, conditioning and everyday training. We invest in the tools that matter so you never have to compromise your session.",
  },
  {
    icon: Shield,
    title: "NO HIDDEN FEES",
    description:
      "One membership price. Classes, full equipment access and the recovery suite are all included — no add-ons, no surprises.",
  },
  {
    icon: Clock,
    title: "OPEN WHEN YOU NEED IT",
    description:
      "Early starts, late nights — we're open 4am–9pm, seven days a week. Your schedule shouldn't be a reason not to train.",
  },
];

const communityPillars = [
  { icon: Zap, label: "Strength" },
  { icon: Heart, label: "Health" },
  { icon: TrendingUp, label: "Progress" },
  { icon: Users, label: "Community" },
  { icon: Target, label: "Discipline" },
  { icon: Shield, label: "Confidence" },
];

const stats = [
  { value: "2,400+", label: "Active Members" },
  { value: "12+", label: "Expert Coaches" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "2026", label: "Est." },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function GalleryImage({
  src,
  alt,
  isPlaceholder,
  style: extraStyle = {},
}: {
  src: string | null;
  alt: string;
  isPlaceholder?: boolean;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  if (isPlaceholder || !src) {
    return (
      <div
        style={{
          ...extraStyle,
          background:
            "repeating-linear-gradient(45deg, #15170F 0px, #15170F 10px, #1D2017 10px, #1D2017 20px)",
          border: "1.5px dashed #2A2E23",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: "#818879",
          fontSize: "0.72rem",
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          textAlign: "center" as const,
          padding: "16px",
          userSelect: "none" as const,
          minHeight: "180px",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B6E509"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.5 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span style={{ opacity: 0.6, maxWidth: "140px", lineHeight: 1.5 }}>{alt}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        ...extraStyle,
        overflow: "hidden",
        borderRadius: "14px",
        position: "relative" as const,
        cursor: "zoom-in",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          objectFit: "cover",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

function ExperienceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 24px",
        background: hovered ? "#1D2017" : "#15170F",
        border: hovered ? "1px solid rgba(182,229,9,0.35)" : "1px solid #2A2E23",
        borderRadius: "14px",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4)" : "0 8px 30px rgba(0,0,0,0.3)",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          background: hovered ? "rgba(182,229,9,0.15)" : "rgba(182,229,9,0.08)",
          border: "1px solid rgba(182,229,9,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          transition: "background 0.25s ease",
        }}
      >
        <Icon size={20} color="#B6E509" strokeWidth={1.5} />
      </div>
      <h3
        className="font-display text-ink"
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: "0 0 12px 0",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p className="font-sans text-ink-muted" style={{ fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      section.style.setProperty("--hx", `${x}%`);
      section.style.setProperty("--hy", `${y}%`);
    };
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div style={{ background: "#0B0D0B" }}>

      {/* ── 1. HERO ── */}
      <section
        ref={heroRef}
        id="about-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "clamp(100px, 14vw, 160px)",
          paddingBottom: "clamp(80px, 10vw, 120px)",
          background: "#0B0D0B",
          "--hx": "50%",
          "--hy": "40%",
        } as React.CSSProperties}
      >
        <div
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 65% 60% at var(--hx) var(--hy), rgba(182,229,9,0.055) 0%, transparent 70%)",
            transition: "background 0.12s ease",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: "clamp(8rem, 22vw, 20rem)",
              fontWeight: 900,
              color: "rgba(182,229,9,0.018)",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            FITPRO
          </span>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1.5px",
            background: "linear-gradient(90deg, transparent, rgba(182,229,9,0.4), transparent)",
            filter: "blur(0.5px)",
          }}
        />

        <Container className="relative z-10">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(40px, 6vw, 72px)", alignItems: "center" }}>
            <div style={{ maxWidth: "780px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <span style={{ width: "28px", height: "2px", background: "#B6E509", display: "block" }} />
                <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                  About FitPro
                </span>
              </div>

              <h1
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 6rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.01em",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Built for those
                <br />
                who choose to{" "}
                <span style={{ WebkitTextStroke: "1.5px rgba(182,229,9,0.85)", color: "transparent" }}>
                  get stronger.
                </span>
              </h1>

              <p
                className="font-sans text-ink-muted"
                style={{
                  marginTop: "clamp(20px, 3vw, 32px)",
                  fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                  lineHeight: 1.7,
                  maxWidth: "560px",
                }}
              >
                FitPro is where fitness meets purpose. A space that brings together community,
                discipline and world-class equipment — built for everyone from first-time
                members to serious athletes.
              </p>

              <div style={{ marginTop: "clamp(36px, 5vw, 52px)", display: "flex", flexWrap: "wrap", gap: "clamp(24px, 5vw, 48px)" }}>
                {stats.map(({ value, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span className="font-display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, lineHeight: 1, color: "#B6E509" }}>
                      {value}
                    </span>
                    <span className="font-sans text-ink-faint" style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "clamp(36px, 5vw, 48px)", display: "flex", flexWrap: "wrap", gap: "14px" }}>
                <Button href="/membership" size="lg">Join Now</Button>
                <Button href="/contact" size="lg" variant="secondary" className="!border-accent/30 !text-accent hover:!border-accent hover:!bg-accent/10">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. OUR STORY ── */}
      <section
        id="about-story"
        style={{ background: "#0F110F", borderTop: "1px solid #2A2E23", borderBottom: "1px solid #2A2E23" }}
      >
        <Container style={{ paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(72px, 10vw, 120px)" }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(48px, 7vw, 80px)", alignItems: "center" }}
            className="about-two-col"
          >
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <span style={{ width: "24px", height: "2px", background: "#B6E509", display: "block" }} />
                  <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                    Our Story
                  </span>
                </div>
                <h2
                  className="font-display text-ink"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.05, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", margin: "0 0 28px 0" }}
                >
                  Built by lifters,
                  <br />
                  <span className="text-accent">for lifters.</span>
                </h2>
                <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "24px", maxWidth: "520px" }}>
                  FitPro started as a single warehouse floor in 2026 — a space built with a clear belief:
                  that a great gym should feel like it was made for the people who actually train there.
                </p>
                <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "40px", maxWidth: "520px" }}>
                  Today, FitPro is a growing community of members who show up because the space, the
                  equipment and the coaching are worth it — not because of a contract. Whether you&apos;re
                  just starting or chasing your best ever lift, this is your floor.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { headline: "2026", sub: "Year Founded" },
                    { headline: "Kathmandu", sub: "Location" },
                    { headline: "Community", sub: "Driven" },
                    { headline: "No Contracts", sub: "Ever" },
                  ].map(({ headline, sub }) => (
                    <div key={sub} style={{ padding: "16px 20px", background: "#15170F", border: "1px solid #2A2E23", borderRadius: "12px" }}>
                      <span className="font-display text-accent" style={{ fontSize: "1.2rem", fontWeight: 700, display: "block" }}>{headline}</span>
                      <span className="font-sans text-ink-faint" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: "16px", border: "1px solid #2A2E23" }}>
                  <Image src="/gym-floor.webp" alt="FitPro gym floor — main training environment" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,13,11,0.9) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px" }}>
                    <span className="font-sans text-ink-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      FitPro Training Floor — Est. 2026
                    </span>
                  </div>
                </div>
                <div style={{ position: "absolute", top: "-20px", right: "-16px", background: "#B6E509", borderRadius: "12px", padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 8px 30px rgba(182,229,9,0.35)", zIndex: 10 }}>
                  <span className="font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0B0D0B", lineHeight: 1 }}>4am</span>
                  <span className="font-sans" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "#1D2017", textTransform: "uppercase", marginTop: "3px" }}>Open Daily</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 3. THE FITPRO EXPERIENCE ── */}
      <section id="about-experience" style={{ background: "#0B0D0B", paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(72px, 10vw, 120px)" }}>
        <Container>
          <Reveal>
            <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ width: "24px", height: "2px", background: "#B6E509", display: "block" }} />
                <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                  The Experience
                </span>
              </div>
              <h2
                className="font-display text-ink"
                style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", maxWidth: "640px", margin: "0 0 16px 0" }}
              >
                What makes FitPro{" "}
                <span style={{ WebkitTextStroke: "1.5px rgba(182,229,9,0.85)", color: "transparent" }}>different.</span>
              </h2>
              <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px" }}>
                Not just a gym. An environment built around the people who train here.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
            {experienceFeatures.map(({ icon, title, description }, i) => (
              <Reveal key={title} delay={i * 80}>
                <ExperienceCard icon={icon} title={title} description={description} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. GYM GALLERY ── */}
      <section
        id="about-gallery"
        style={{ background: "#0F110F", borderTop: "1px solid #2A2E23", paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(72px, 10vw, 120px)" }}
      >
        <Container>
          <Reveal>
            <div style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ width: "24px", height: "2px", background: "#B6E509", display: "block" }} />
                <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                  Gym Tour
                </span>
              </div>
              <h2
                className="font-display text-ink"
                style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", margin: "0 0 16px 0" }}
              >
                Explore the <span className="text-accent">facility.</span>
              </h2>
              <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "500px" }}>
                Every zone is purpose-built for a different kind of training. Take a look around.
              </p>
              <div style={{ marginTop: "36px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {galleryCategories.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(i)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "999px",
                      border: activeCategory === i ? "1.5px solid #B6E509" : "1px solid #2A2E23",
                      background: activeCategory === i ? "rgba(182,229,9,0.1)" : "transparent",
                      color: activeCategory === i ? "#B6E509" : "#A8AE9E",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {galleryCategories.map((cat, i) => (
            <div key={cat.id} style={{ display: activeCategory === i ? "block" : "none" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "28px" }}>
                <div>
                  <h3 className="font-display text-ink" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 900, textTransform: "uppercase", margin: "0 0 8px 0" }}>
                    {cat.title}
                  </h3>
                  <p className="font-sans text-ink-muted" style={{ fontSize: "0.92rem", lineHeight: 1.65, maxWidth: "480px" }}>
                    {cat.description}
                  </p>
                </div>
                <span className="font-sans text-ink-faint" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {i + 1} / {galleryCategories.length}
                </span>
              </div>

              {/* Editorial grid */}
              <div className="about-gallery-grid">
                <GalleryImage
                  src={cat.featured.src}
                  alt={cat.featured.alt}
                  isPlaceholder={cat.featured.isPlaceholder}
                  style={{ gridColumn: "1 / 2", gridRow: "1 / 3", aspectRatio: "3/4", position: "relative" } as React.CSSProperties}
                />
                {cat.secondary.map((img, si) => (
                  <GalleryImage
                    key={si}
                    src={img.src}
                    alt={img.alt}
                    isPlaceholder={img.isPlaceholder}
                    style={{ gridColumn: "2 / 3", gridRow: `${si + 1} / ${si + 2}`, aspectRatio: "4/3", position: "relative" } as React.CSSProperties}
                  />
                ))}
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                {(["←", "→"] as const).map((arrow, ai) => (
                  <button
                    key={arrow}
                    onClick={() =>
                      setActiveCategory((prev) =>
                        ai === 0
                          ? prev === 0 ? galleryCategories.length - 1 : prev - 1
                          : prev === galleryCategories.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="gallery-nav-btn"
                    aria-label={ai === 0 ? "Previous gallery category" : "Next gallery category"}
                  >
                    {arrow}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* ── 5. TRAIN WITH PURPOSE ── */}
      <section
        id="about-philosophy"
        style={{ position: "relative", overflow: "hidden", borderTop: "1px solid #2A2E23", background: "#0B0D0B", paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(72px, 10vw, 120px)" }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image src="/hero-gym.png" alt="" fill style={{ objectFit: "cover", objectPosition: "right center", opacity: 0.18 }} aria-hidden="true" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,13,11,1) 40%, rgba(11,13,11,0.65) 100%)" }} />
        </div>
        <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(182,229,9,0.45), transparent)", filter: "blur(1px)", zIndex: 1 }} />

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ maxWidth: "700px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <span style={{ width: "24px", height: "2px", background: "#B6E509", display: "block" }} />
                <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                  Our Philosophy
                </span>
              </div>
              <h2
                className="font-display text-ink"
                style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", lineHeight: 1.02, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", margin: "0 0 28px 0" }}
              >
                Train with <span className="text-accent">purpose.</span>
                <br />
                Live with{" "}
                <span style={{ WebkitTextStroke: "1.5px rgba(182,229,9,0.85)", color: "transparent" }}>power.</span>
              </h2>
              <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, maxWidth: "520px", marginBottom: "20px" }}>
                Every rep counts. Every session matters. We believe that discipline is the foundation
                of everything — the discipline to show up, to push through, and to be consistent
                even when it isn&apos;t easy.
              </p>
              <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, maxWidth: "520px" }}>
                Progress isn&apos;t measured in weeks. It&apos;s built through months of showing up,
                learning your body, and trusting the process. FitPro exists to support that journey
                at every stage.
              </p>
              <div style={{ marginTop: "44px", paddingLeft: "24px", borderLeft: "3px solid #B6E509" }}>
                <p
                  className="font-display text-ink"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.35, margin: 0 }}
                >
                  &quot;Strength is not given.
                  <br />
                  It is built — one session at a time.&quot;
                </p>
                <span className="font-sans text-ink-faint" style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "10px", display: "block" }}>
                  — The FitPro Ethos
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 6. COMMUNITY ── */}
      <section
        id="about-community"
        style={{ background: "#0F110F", borderTop: "1px solid #2A2E23", borderBottom: "1px solid #2A2E23", paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(72px, 10vw, 120px)" }}
      >
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(48px, 7vw, 80px)", alignItems: "center" }} className="about-two-col">
            <Reveal>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", borderRadius: "16px", border: "1px solid #2A2E23" }}>
                  <Image src="/hero-gym.png" alt="FitPro member training — the community in action" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "right center" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(11,13,11,0.85) 100%)" }} />
                  <div style={{ position: "absolute", bottom: "28px", left: "28px", right: "28px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {["Strength", "Discipline", "Progress", "Community"].map((tag) => (
                        <span key={tag} style={{ padding: "5px 14px", background: "rgba(182,229,9,0.15)", border: "1px solid rgba(182,229,9,0.35)", borderRadius: "999px", color: "#B6E509", fontSize: "0.65rem", fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <span style={{ width: "24px", height: "2px", background: "#B6E509", display: "block" }} />
                  <span className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509" }}>
                    Community
                  </span>
                </div>
                <h2
                  className="font-display text-ink"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.05, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", margin: "0 0 24px 0" }}
                >
                  More than <span className="text-accent">a gym.</span>
                </h2>
                <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "20px", maxWidth: "480px" }}>
                  FitPro brings together people from all walks of life — united by a single commitment
                  to becoming a better version of themselves. No judgment. No ego. Just work.
                </p>
                <p className="font-sans text-ink-muted" style={{ fontSize: "1rem", lineHeight: 1.75, marginBottom: "48px", maxWidth: "480px" }}>
                  Whether you&apos;re here to lose weight, build muscle, manage stress, compete, or simply
                  move more — FitPro has a place for you and a community that&apos;ll back you every step.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                  {communityPillars.map(({ icon: Icon, label }) => (
                    <CommunityPillar key={label} icon={Icon} label={label} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 7. CTA ── */}
      <section
        id="about-cta"
        style={{ position: "relative", overflow: "hidden", background: "#0B0D0B", paddingTop: "clamp(80px, 12vw, 140px)", paddingBottom: "clamp(80px, 12vw, 140px)" }}
      >
        <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(182,229,9,0.45), transparent)", filter: "blur(0.5px)" }} />
        <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "50%", height: "200px", background: "radial-gradient(ellipse at 50% 0%, rgba(182,229,9,0.06) 0%, transparent 70%)" }} />
        <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", userSelect: "none" }}>
          <span className="font-display" style={{ fontSize: "clamp(5rem, 18vw, 16rem)", fontWeight: 900, color: "rgba(182,229,9,0.018)", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
            STRONGER
          </span>
        </div>

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
              <p className="font-sans" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B6E509", marginBottom: "24px" }}>
                Ready to begin
              </p>
              <h2
                className="font-display text-ink"
                style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", lineHeight: 1.02, letterSpacing: "-0.01em", fontWeight: 900, textTransform: "uppercase", margin: "0 0 28px 0" }}
              >
                Ready to start
                <br />
                <span style={{ WebkitTextStroke: "1.5px rgba(182,229,9,0.85)", color: "transparent" }}>
                  your journey?
                </span>
              </h2>
              <p className="font-sans text-ink-muted" style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 44px" }}>
                Your next chapter starts with your next workout. Join the FitPro community and take
                the first step toward the strongest version of yourself.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
                <Link
                  href="/register"
                  id="about-cta-join-now"
                  className="about-cta-primary"
                >
                  Join Now
                  <ChevronRight size={18} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/membership"
                  id="about-cta-view-plans"
                  className="about-cta-secondary"
                >
                  View Memberships
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Page-scoped styles ── */}
      <style>{`
        .about-gallery-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: auto auto;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .about-gallery-grid {
            grid-template-columns: 1fr;
          }
          .about-gallery-grid > * {
            grid-column: 1 / 2 !important;
            grid-row: auto !important;
            aspect-ratio: 4/3 !important;
          }
        }

        .about-two-col {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .about-two-col {
            grid-template-columns: 1fr 1fr;
          }
        }

        .gallery-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid #2A2E23;
          background: transparent;
          color: #A8AE9E;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          line-height: 1;
        }
        .gallery-nav-btn:hover {
          border-color: #B6E509;
          color: #B6E509;
        }

        .about-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 999px;
          background: #B6E509;
          color: #0B0D0B;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .about-cta-primary:hover {
          background: #C7FA1F;
          box-shadow: 0 0 32px rgba(182,229,9,0.5), 0 0 64px rgba(182,229,9,0.15);
          transform: translateY(-2px);
        }

        .about-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 16px 36px;
          border-radius: 999px;
          border: 1px solid #2A2E23;
          color: #A8AE9E;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .about-cta-secondary:hover {
          border-color: rgba(182,229,9,0.4);
          color: #F3F5EE;
        }
      `}</style>
    </div>
  );
}

function CommunityPillar({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px 12px",
        background: hovered ? "#1D2017" : "#15170F",
        border: hovered ? "1px solid rgba(182,229,9,0.4)" : "1px solid #2A2E23",
        borderRadius: "12px",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
    >
      <Icon size={20} color="#B6E509" strokeWidth={1.5} />
      <span className="font-sans text-ink-muted" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}
