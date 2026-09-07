import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — FitPro Gym Management",
  description: "Create your FitPro account to get started with your fitness journey.",
};

/**
 * Register route layout — intentionally bare (no Navbar / Footer)
 * so the page can render its own full-screen background + card UI.
 */
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
