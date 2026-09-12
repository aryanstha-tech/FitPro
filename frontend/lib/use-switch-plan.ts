"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { membershipService } from "@/services/membership.service";
import { ApiError } from "@/lib/api-client";

/**
 * Shared by PackageGrid (public /membership page) and
 * dashboard/membership/page.tsx (the "Switch plan" section) — both call
 * membershipService.switchPlan() and need the same 401-redirects-to-login
 * behavior. `onSuccess` lets each caller decide what happens next: the
 * public page redirects to the dashboard, the dashboard page just
 * re-fetches its own membership in place.
 */
export function useSwitchPlan(onSuccess?: () => void) {
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function switchPlan(packageId: string | number) {
    setError(null);
    setSwitchingId(String(packageId));
    try {
      await membershipService.switchPlan(Number(packageId));
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Couldn't switch plans. Try again.");
    } finally {
      setSwitchingId(null);
    }
  }

  return { switchPlan, switchingId, error };
}