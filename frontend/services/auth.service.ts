import { apiFetch } from "@/lib/api-client";
import type { AuthResponse, CurrentUser, LoginPayload, RegisterPayload } from "@/types/auth";

const TOKEN_KEY = "fitpro_access_token";
const REFRESH_KEY = "fitpro_refresh_token";
const USER_KEY = "fitpro_user";

function storeSession(data: AuthResponse) {
  window.localStorage.setItem(TOKEN_KEY, data.tokens.access);
  window.localStorage.setItem(REFRESH_KEY, data.tokens.refresh);
  window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: payload,
      auth: false,
    });
    storeSession(data);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: payload,
      auth: false,
    });
    storeSession(data);
    return data;
  },

  logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
  },

  me(): Promise<CurrentUser> {
    return apiFetch<CurrentUser>("/auth/me/");
  },

  async updateMe(
    patch: Partial<Pick<CurrentUser, "name" | "email">> & { password?: string }
  ): Promise<CurrentUser> {
    const user = await apiFetch<CurrentUser>("/auth/me/", { method: "PATCH", body: patch });
    // Keep the cached copy (used by route guards) in sync.
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(TOKEN_KEY));
  },

  // NOTE: this is the last-known role from login/register, cached client-side
  // for instant route-guard checks — not re-verified against the server on
  // every navigation. `RequireAuth` re-fetches `/auth/me/` in the background
  // and signs the user out if the server disagrees (token revoked, role
  // changed, etc).
  getCachedUser(): CurrentUser | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  },
};
