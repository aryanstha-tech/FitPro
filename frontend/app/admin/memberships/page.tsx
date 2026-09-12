"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { daysUntil, formatDate } from "@/components/membership/MembershipCard";
import { memberService } from "@/services/member.service";
import { ApiError } from "@/lib/api-client";
import type { Member } from "@/types/member";

const statusTone = { active: "accent", expiring: "warning", expired: "danger" } as const;

export default function MembershipManagementPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    memberService
      .list()
      .then(setMembers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load members."));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-display-md text-ink">Memberships</h1>
        <span className="text-xs text-ink-faint">Members sign up via the public registration page</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {members === null && !error ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <DataTable
            rows={members ?? []}
            rowKey={(m) => String(m.id)}
            columns={[
              { header: "Name", render: (m) => m.name },
              { header: "Email", render: (m) => <span className="text-ink-muted">{m.email}</span> },
              { header: "Plan", render: (m) => m.plan ?? "—" },
              { header: "Member since", render: (m) => <span className="text-ink-muted">{m.memberSince}</span> },
              {
                header: "Expiry",
                render: (m) => {
                  if (!m.renewsOn) return <span className="text-ink-faint">—</span>;
                  const remaining = daysUntil(m.renewsOn);
                  const soon = m.planStatus !== "expired" && remaining >= 0 && remaining <= 3;
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-ink-muted">{formatDate(m.renewsOn)}</span>
                      {soon && (
                        <Badge tone="warning">
                          {remaining} {remaining === 1 ? "day" : "days"}
                        </Badge>
                      )}
                    </div>
                  );
                },
              },
              { header: "Status", render: (m) => <Badge tone={statusTone[m.planStatus]}>{m.planStatus}</Badge> },
            ]}
          />
        )}
      </div>
    </div>
  );
}