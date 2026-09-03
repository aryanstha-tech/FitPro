"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await authService.register({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      router.push("/membership");
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors?.email) {
        setError(err.fieldErrors.email[0]);
      } else {
        setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center pb-24 pt-36">
      <Container className="max-w-sm">
        <h1 className="text-display-md text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Set up your login, then choose a membership package.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Input label="Full name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Password" name="password" type="password" required />
          {error && <span className="text-sm text-red-400">{error}</span>}
          <Button type="submit" size="lg" className="mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          Already a member?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </Container>
    </div>
  );
}
