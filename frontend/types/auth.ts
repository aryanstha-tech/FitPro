export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  memberSince: string;
  plan: string | null;
  planStatus: "active" | "expiring" | "expired";
  renewsOn: string | null;
  role: "member" | "staff" | "admin";
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirm_password: string;
  gender: "male" | "female";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: CurrentUser;
  tokens: AuthTokens;
}