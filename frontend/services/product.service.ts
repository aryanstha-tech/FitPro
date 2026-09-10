import { apiFetch } from "@/lib/api-client";
import type { Product } from "@/types/product";
import type { PaginatedResponse } from "@/types/order";

interface ListProductsParams {
  category?: string;
  search?: string;
  inStock?: boolean;
}

export const productService = {
  create(payload: FormData): Promise<Product> {
    return apiFetch<Product>("/products/", {
      method: "POST",
      body: payload,
    });
  },

  async list(params: ListProductsParams = {}): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.inStock) query.set("in_stock", "true");

    const qs = query.toString();
    const data = await apiFetch<PaginatedResponse<Product>>(`/products/${qs ? `?${qs}` : ""}`, {
      auth: false,
    });
    return data.results;
  },

  bySlug(slug: string): Promise<Product> {
    return apiFetch<Product>(`/products/${slug}/`, { auth: false });
  },
};
