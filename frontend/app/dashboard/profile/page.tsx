"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";
import type { CurrentUser } from "@/types/auth";

export default function ProfilePage() {
  // authService.getCachedUser() reads the real logged-in user (stored at
  // login/register) so the form shows correct data immediately, with no
  // loading flash. authService.me() then re-fetches in the background to
  // pick up anything changed server-side since login — the same pattern
  // RequireAuth already uses for its own auth check.
  const [user, setUser] = useState<CurrentUser | null>(() => authService.getCachedUser());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authService.me().then(setUser).catch(() => {
      // If /auth/me/ fails here, RequireAuth (wrapping the whole dashboard)
      // will already be handling the sign-out/redirect — nothing to do here.
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");

    try {
      const updated = await authService.updateMe({
        name: String(form.get("name")),
        email: String(form.get("email")),
        ...(password ? { password } : {}),
      });
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save changes. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <p className="text-sm text-ink-muted">Loading profile...</p>;

  return (
    <div>
      <h1 className="text-display-md text-ink">Profile</h1>
      <p className="mt-2 text-sm text-ink-muted">Member since {user.memberSince}.</p>

      {user.plan && (
        <div className="mt-6 max-w-sm">
          <MembershipCard
            planName={user.plan}
            status={user.planStatus}
            renewsOn={user.renewsOn ?? "—"}
          />
        </div>
      )}

      <h2 className="mb-4 mt-10 text-sm font-medium text-ink-muted">Account details</h2>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-5">
        <Input label="Full name" name="name" defaultValue={user.name} required />
        <Input label="Email" name="email" type="email" defaultValue={user.email} required />
        <Input label="New password" name="password" type="password" placeholder="Leave blank to keep current" />
        {error && <span className="text-sm text-red-400">{error}</span>}
        <Button type="submit" size="lg" className="mt-2 self-start" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
        {saved && <span className="text-sm text-accent">Saved.</span>}
      </form>
    </div>
  );
}