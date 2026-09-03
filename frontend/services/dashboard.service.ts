import { apiFetch } from "@/lib/api-client";
import type { DashboardSummary, MembershipMixEntry, RevenuePoint } from "@/types/dashboard";

export const dashboardService = {
  summary(): Promise<DashboardSummary> {
    return apiFetch<DashboardSummary>("/dashboard/summary/");
  },

  revenue(months = 6): Promise<RevenuePoint[]> {
    return apiFetch<RevenuePoint[]>(`/dashboard/revenue/?months=${months}`);
  },

  membershipMix(): Promise<MembershipMixEntry[]> {
    return apiFetch<MembershipMixEntry[]>("/dashboard/membership-mix/");
  },
};
