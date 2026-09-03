import { apiFetch } from "@/lib/api-client";
import type { StaffMember } from "@/types/staff";
import type { PaginatedResponse } from "@/types/order";

export const staffService = {
  async list(): Promise<StaffMember[]> {
    const data = await apiFetch<PaginatedResponse<StaffMember>>("/staff/");
    return data.results;
  },

  create(payload: Pick<StaffMember, "name" | "email" | "role">): Promise<StaffMember> {
    return apiFetch<StaffMember>("/staff/", { method: "POST", body: payload });
  },

  update(id: number, patch: Partial<Pick<StaffMember, "role" | "status">>): Promise<StaffMember> {
    return apiFetch<StaffMember>(`/staff/${id}/`, { method: "PATCH", body: patch });
  },

  remove(id: number): Promise<void> {
    return apiFetch<void>(`/staff/${id}/`, { method: "DELETE" });
  },
};
