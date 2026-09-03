import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────
// FitPro Design Tokens
// Derived from the supplied Figma/reference screenshot:
// dark athletic photography, single lime-green accent,
// condensed display type for headlines, clean sans for UI.
// ─────────────────────────────────────────────────────────

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces — near-black with a faint cool-green cast,
        // matched to the gym-floor photography rather than a flat #000.
        base: {
          DEFAULT: "#0B0D0B", // page background
          surface: "#15170F", // card / panel background
          raised: "#1D2017", // hover / raised surface
          border: "#2A2E23", // hairline borders on dark
        },
        // Single accent — the FitPro lime.
        accent: {
          DEFAULT: "#B6E509",
          hover: "#C7FA1F",
          muted: "#B6E50922", // 13% opacity wash for highlights/badges
        },
        ink: {
          DEFAULT: "#F3F5EE", // primary text on dark
          muted: "#A8AE9E", // secondary text
          faint: "#818879", // tertiary / disabled — tuned to clear WCAG AA (4.5:1) at text-xs against base, base-surface, and base-raised
        },
      },
      fontFamily: {
        // Display: condensed, athletic — used for the logo wordmark,
        // hero headlines, big stats. Never for body copy or UI labels.
        display: ["var(--font-display)", "sans-serif"],
        // Body/UI: neutral, highly legible sans for everything else.
        sans: ["var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        // Type scale (Elements of Typographic Style ratios, ~1.25)
        "display-xl": ["4.5rem", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        "display-lg": ["3.25rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-md": ["2.25rem", { lineHeight: "1.1" }],
        "display-sm": ["1.625rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        // Pills for interactive controls (matches the "Join Now" CTA),
        // a smaller, distinct radius for content containers (cards).
        pill: "999px",
        card: "14px",
        control: "10px",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(182,229,9,0.4), 0 0 24px -4px rgba(182,229,9,0.35)",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
