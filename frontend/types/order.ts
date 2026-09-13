export interface Order {
  id: number;
  date: string;
  items: string;
  total: string;
  status: "pending_payment" | "processing" | "delivered" | "cancelled";
  // Only present in the response to orderService.create(), and only when
  // the payment gateway needs a redirect (Khalti) — absent for
  // MockPaymentProvider, where the order is already resolved.
  paymentUrl?: string;
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