export interface Order {
  id: number;
  date: string;
  items: string;
  total: string;
  status: "pending_payment" | "paid" | "processing" | "delivered" | "cancelled";
  // Only present in the response to orderService.create(), and only when
  // the payment gateway needs a redirect (Khalti) — absent for
  // MockPaymentProvider, where the order is already resolved.
  paymentUrl?: string;
  // Admin/Payments-page fields — present on every Order response, but
  // only actually used where the UI needs to show who/what an order was.
  customerName?: string;
  customerEmail?: string;
  paymentReference?: string | null;
  packageName?: string | null;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  // Exactly one of these two — never both, per the backend's validate().
  items?: CreateOrderItem[];
  packageId?: number;
  idempotencyKey?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}