export interface Package {
  id: string;
  name: string;
  price: number;
  billing: "month" | "year";
  featured?: boolean;
  perks: string[];
}

export const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    billing: "month",
    perks: ["Full gym floor access", "Locker room access", "1 guest pass / month"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 59,
    billing: "month",
    featured: true,
    perks: [
      "Everything in Basic",
      "Unlimited group classes",
      "Recovery suite access",
      "4 guest passes / month",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 99,
    billing: "month",
    perks: [
      "Everything in Pro",
      "2 personal training sessions / month",
      "Nutrition consultation",
      "Priority class booking",
    ],
  },
];

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "fitpro-training-tee",
    name: "FitPro Training Tee",
    price: 28,
    category: "Apparel",
    image: "/products/tee.jpg",
    description:
      "Lightweight, breathable training tee built for high-rep sessions. Moisture-wicking fabric, tagless collar.",
    inStock: true,
  },
  {
    id: "p2",
    slug: "adjustable-dumbbell-set",
    name: "Adjustable Dumbbell Set",
    price: 249,
    category: "Equipment",
    image: "/products/dumbbells.jpg",
    description:
      "5–52.5 lb per hand in one compact unit. Quick-turn dial swaps weight in seconds.",
    inStock: true,
  },
  {
    id: "p3",
    slug: "whey-protein-vanilla",
    name: "Whey Protein — Vanilla",
    price: 44,
    category: "Nutrition",
    image: "/products/protein.jpg",
    description: "25g protein per scoop, low sugar, mixes clean. 30 servings per bag.",
    inStock: false,
  },
  {
    id: "p4",
    slug: "lifting-straps",
    name: "Lifting Straps",
    price: 16,
    category: "Accessories",
    image: "/products/straps.jpg",
    description: "Padded cotton straps for heavy pulls — deadlifts, rows, shrugs.",
    inStock: true,
  },
];

export interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: "delivered" | "processing" | "cancelled";
}

export const orders: Order[] = [
  { id: "FP-1042", date: "Aug 21, 2026", items: "Adjustable Dumbbell Set", total: 249, status: "delivered" },
  { id: "FP-1039", date: "Aug 10, 2026", items: "FitPro Training Tee ×2", total: 56, status: "delivered" },
  { id: "FP-1031", date: "Jul 28, 2026", items: "Whey Protein — Vanilla", total: 44, status: "processing" },
  { id: "FP-1020", date: "Jul 12, 2026", items: "Lifting Straps", total: 16, status: "cancelled" },
];

export interface CurrentUser {
  name: string;
  email: string;
  memberSince: string;
  plan: string;
  planStatus: "active" | "expiring" | "expired";
  renewsOn: string;
}

export const currentUser: CurrentUser = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  memberSince: "March 2024",
  plan: "Pro",
  planStatus: "active",
  renewsOn: "Sep 14, 2026",
};

// ── Admin area ──────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "expiring" | "expired";
  joined: string;
}

export const members: Member[] = [
  { id: "m1", name: "Alex Morgan", email: "alex.morgan@example.com", plan: "Pro", status: "active", joined: "Mar 2024" },
  { id: "m2", name: "Jordan Lee", email: "jordan.lee@example.com", plan: "Elite", status: "active", joined: "Jan 2025" },
  { id: "m3", name: "Sam Rivera", email: "sam.rivera@example.com", plan: "Basic", status: "expiring", joined: "Jun 2025" },
  { id: "m4", name: "Casey Kim", email: "casey.kim@example.com", plan: "Pro", status: "expired", joined: "Nov 2023" },
];

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Coach" | "Front Desk" | "Manager";
  status: "active" | "inactive";
}

export const staff: StaffMember[] = [
  { id: "s1", name: "Taylor Brooks", email: "taylor.brooks@fitpro.com", role: "Manager", status: "active" },
  { id: "s2", name: "Morgan Diaz", email: "morgan.diaz@fitpro.com", role: "Coach", status: "active" },
  { id: "s3", name: "Riley Chen", email: "riley.chen@fitpro.com", role: "Front Desk", status: "active" },
  { id: "s4", name: "Jamie Fox", email: "jamie.fox@fitpro.com", role: "Coach", status: "inactive" },
];

export interface InventoryItem {
  productId: string;
  name: string;
  sku: string;
  stock: number;
  reorderAt: number;
}

export const inventory: InventoryItem[] = [
  { productId: "p1", name: "FitPro Training Tee", sku: "FP-TEE-001", stock: 84, reorderAt: 20 },
  { productId: "p2", name: "Adjustable Dumbbell Set", sku: "FP-DBL-002", stock: 6, reorderAt: 10 },
  { productId: "p3", name: "Whey Protein — Vanilla", sku: "FP-PRO-003", stock: 0, reorderAt: 15 },
  { productId: "p4", name: "Lifting Straps", sku: "FP-STR-004", stock: 42, reorderAt: 15 },
];

export const monthlyRevenue: { month: string; revenue: number }[] = [
  { month: "Mar", revenue: 18200 },
  { month: "Apr", revenue: 19850 },
  { month: "May", revenue: 21100 },
  { month: "Jun", revenue: 20400 },
  { month: "Jul", revenue: 23600 },
  { month: "Aug", revenue: 25150 },
];
