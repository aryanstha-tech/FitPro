export interface DashboardSummary {
  activeMembers: number;
  ordersThisMonth: number;
  lowStockCount: number;
  monthRevenue: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface MembershipMixEntry {
  plan: string;
  count: number;
}

export interface InventoryItem {
  productId: number;
  name: string;
  sku: string;
  stock: number;
  reorderAt: number;
}
