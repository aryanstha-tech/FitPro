"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { staffService } from "@/services/staff.service";
import { ApiError } from "@/lib/api-client";
import type { StaffMember } from "@/types/staff";

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function loadStaff() {
    staffService
      .list()
      .then(setStaff)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load staff."));
  }

  useEffect(loadStaff, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      await staffService.create({
        name: String(form.get("name")),
        email: String(form.get("email")),
        role: form.get("role") as StaffMember["role"],
      });
      setShowAdd(false);
      loadStaff();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't add staff member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-display-md text-ink">Staff</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          Add staff member
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {staff === null && !error ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <DataTable
            rows={staff ?? []}
            rowKey={(s) => String(s.id)}
            columns={[
              { header: "Name", render: (s) => s.name },
              { header: "Email", render: (s) => <span className="text-ink-muted">{s.email}</span> },
              { header: "Role", render: (s) => s.role },
              {
                header: "Status",
                render: (s) => (
                  <Badge tone={s.status === "active" ? "accent" : "neutral"}>{s.status}</Badge>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add staff member">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input label="Name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-sm text-ink-muted">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="rounded-control border border-base-border bg-base-raised px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="Coach">Coach</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <p className="text-xs text-ink-faint">
            New staff start as inactive until they accept an email invite.
          </p>
          {formError && <span className="text-sm text-red-400">{formError}</span>}
          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Adding..." : "Add staff member"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
