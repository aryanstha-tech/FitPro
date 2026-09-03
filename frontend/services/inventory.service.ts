import { apiFetch } from "@/lib/api-client";
import type { InventoryItem } from "@/types/dashboard";
import type { PaginatedResponse } from "@/types/order";

export const inventoryService = {
  async list(lowStockOnly = false): Promise<InventoryItem[]> {
    const qs = lowStockOnly ? "?low_stock=true" : "";
    const data = await apiFetch<PaginatedResponse<InventoryItem>>(`/inventory/${qs}`);
    return data.results;
  },

  updateStock(productId: number, stock: number): Promise<InventoryItem> {
    return apiFetch<InventoryItem>(`/inventory/${productId}/`, {
      method: "PATCH",
      body: { stock },
    });
  },
};
