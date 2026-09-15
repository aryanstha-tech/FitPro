import { apiFetch } from "@/lib/api-client";
import type { Membership, Package } from "@/types/membership";
import type { PaginatedResponse } from "@/types/order";

export const membershipService = {
  async listPackages(): Promise<Package[]> {
    const data = await apiFetch<PaginatedResponse<Package>>("/packages/", { auth: false });
    return data.results;
  },

  createPackage(payload: Omit<Package, "id">): Promise<Package> {
    return apiFetch<Package>("/packages/", { method: "POST", body: payload });
  },

  myMembership(): Promise<Membership> {
    return apiFetch<Membership>("/memberships/me/");
  },
  // Admin-only now (backend: IsAdmin) — a manual/comp membership grant for
  // a specific member, NOT the member purchase flow. Real member
  // purchases go through orderService.create({ packageId }) instead,
  // which is payment-gated.
  adminAssignMembership(userId: number, packageId: number): Promise<Membership> {
    return apiFetch<Membership>("/memberships/switch/", {
      method: "POST",
      body: { userId, packageId },
    });
  },
  renew(): Promise<Membership> {
    return apiFetch<Membership>("/memberships/renew/", { method: "POST" });
  },

  cancel(): Promise<Membership> {
    return apiFetch<Membership>("/memberships/cancel/", { method: "POST" });
  },
};
