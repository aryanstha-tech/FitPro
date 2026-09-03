import { apiFetch } from "@/lib/api-client";
import type { Member } from "@/types/member";
import type { PaginatedResponse } from "@/types/order";

export const memberService = {
  async list(search?: string): Promise<Member[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<PaginatedResponse<Member>>(`/members/${qs}`);
    return data.results;
  },

  update(id: number, patch: Partial<Pick<Member, "plan" | "planStatus">>): Promise<Member> {
    return apiFetch<Member>(`/members/${id}/`, { method: "PATCH", body: patch });
  },

  deactivate(id: number): Promise<void> {
    return apiFetch<void>(`/members/${id}/`, { method: "DELETE" });
  },
};
