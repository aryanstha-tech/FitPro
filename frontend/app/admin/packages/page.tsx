"use client";

import { FormEvent, useEffect, useState } from "react";
import { PackageCard } from "@/components/membership/PackageCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { membershipService } from "@/services/membership.service";
import { ApiError } from "@/lib/api-client";
import type { Package as MockPackage } from "@/lib/mock-data";

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<MockPackage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function loadPackages() {
    membershipService
      .listPackages()
      .then((data) =>
        setPackages(
          data.map((p) => ({
            id: String(p.id),
            name: p.name,
            price: Number(p.price),
            billing: p.billing,
            featured: p.featured,
            perks: p.perks,
          }))
        )
      )
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load packages."));
  }

  useEffect(loadPackages, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      await membershipService.createPackage({
        name: String(form.get("name")),
        price: String(form.get("price")),
        billing: form.get("billing") === "year" ? "year" : "month",
        featured: form.get("featured") === "on",
        perks: String(form.get("perks"))
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      });
      setShowAdd(false);
      loadPackages();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't create package.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-display-md text-ink">Packages</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          Add package
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages === null && !error && <p className="text-sm text-ink-muted">Loading...</p>}
        {packages?.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add package">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input label="Name" name="name" required />
          <Input label="Price" name="price" type="number" min="0" step="0.01" required />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="billing" className="text-sm text-ink-muted">
              Billing
            </label>
            <select
              id="billing"
              name="billing"
              className="rounded-control border border-base-border bg-base-raised px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <Input label="Perks (comma-separated)" name="perks" placeholder="Unlimited classes, Guest passes" />
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" name="featured" className="accent-accent" />
            Featured / most popular
          </label>
          {formError && <span className="text-sm text-red-400">{formError}</span>}
          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Creating..." : "Create package"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
