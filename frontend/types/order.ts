export interface Order {
  id: number;
  date: string;
  items: string;
  total: string;
  status: "delivered" | "processing" | "cancelled";
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  idempotencyKey?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
