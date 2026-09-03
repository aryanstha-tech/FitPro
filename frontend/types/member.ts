export interface Member {
  id: number;
  name: string;
  email: string;
  memberSince: string;
  plan: string | null;
  planStatus: "active" | "expiring" | "expired";
  renewsOn: string | null;
  role: "member" | "staff" | "admin";
}
