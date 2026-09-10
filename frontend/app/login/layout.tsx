import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — FitPro Gym Management",
  description: "Log in to your FitPro account to manage your gym, track workouts, and access membership.",
};

/**
 * Login route layout — bare layout without Navbar / Footer
 * so the page renders its own full-screen custom background + card layout.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
