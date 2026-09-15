export interface Order {
  id: number;
  date: string;
  items: string;
  total: string;

  status:
    | "pending_payment"
    | "processing"
    | "completed"
    | "delivered"
    | "cancelled";

  paymentUrl?: string;

  customerName?: string;
  customerEmail?: string;

  paymentReference?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: "pending" | "paid" | "failed";

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