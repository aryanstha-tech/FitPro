export interface Package {
  id: number;
  name: string;
  price: string; // DRF DecimalField serializes as a string
  billing: "month" | "year";
  featured: boolean;
  perks: string[];
}

export interface Membership {
  id: number;
  package: Package;
  status: "active" | "expiring" | "expired";
  started_on: string;
  renews_on: string;
}
