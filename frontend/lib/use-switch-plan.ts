"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";

export function useSwitchPlan(onSuccess?: () => void) {
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function switchPlan(packageId: string | number) {
    setError(null);
    setSwitchingId(String(packageId));
    try {
      const order = await orderService.create({ packageId: Number(packageId) });
      if (order.paymentUrl) {
        window.location.href = order.paymentUrl;
        return;
      }
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