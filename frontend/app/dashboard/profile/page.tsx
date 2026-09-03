"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { currentUser } from "@/lib/mock-data";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");

    try {
      await authService.updateMe({
        name: String(form.get("name")),
        email: String(form.get("email")),
        ...(password ? { password } : {}),
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save changes. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-display-md text-ink">Profile</h1>
      <p className="mt-2 text-sm text-ink-muted">Update your account details.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-5">
        <Input label="Full name" name="name" defaultValue={currentUser.name} required />
        <Input label="Email" name="email" type="email" defaultValue={currentUser.email} required />
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
