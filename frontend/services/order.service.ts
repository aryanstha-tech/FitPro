import { apiFetch } from "@/lib/api-client";
import type { CreateOrderPayload, Order, PaginatedResponse } from "@/types/order";

export const orderService = {
  async myOrders(): Promise<Order[]> {
    const data = await apiFetch<PaginatedResponse<Order>>("/orders/me/");
    return data.results;
  },

  create(payload: CreateOrderPayload): Promise<Order> {
    return apiFetch<Order>("/orders/", { method: "POST", body: payload });
  },

  // Called from the Khalti callback page once the user returns from
  // paying — re-confirms with the gateway server-side rather than
  // trusting the redirect's own query params.
  verifyPayment(orderId: number): Promise<Order> {
    return apiFetch<Order>(`/orders/${orderId}/verify-payment/`, { method: "POST" });
  },

  // Admin/staff only — matches ?status= filter in API_CONTRACTS.md
  async listAll(status?: Order["status"]): Promise<Order[]> {
    const qs = status ? `?status=${status}` : "";
    const data = await apiFetch<PaginatedResponse<Order>>(`/orders/${qs}`);
    return data.results;
  },

  updateStatus(id: number, status: Order["status"]): Promise<Order> {
    return apiFetch<Order>(`/orders/${id}/`, { method: "PATCH", body: { status } });
  },
};