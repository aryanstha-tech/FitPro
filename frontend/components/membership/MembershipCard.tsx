import { Card, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface MembershipCardProps {
  planName: string;
  status: "active" | "expiring" | "expired";
  renewsOn: string;
  // Optional: only /dashboard/membership passes these. The overview and
  // profile pages render this same card read-only, so no action buttons
  // appear there — better than a "Manage plan" button that does nothing.
  onCancel?: () => void;
  onRenew?: () => void;
  busy?: boolean;
}

const statusTone = {
  active: "accent",
  expiring: "warning",
  expired: "danger",
} as const;

const statusLabel = {
  active: "Active",
  expiring: "Renews soon",
  expired: "Expired",
} as const;

// Same "exactly 3 days away" idea as the backend's send_expiry_reminders
// task — this just makes that window visible in the UI too. Renders no
// warning for an already-expired membership, since there's nothing left
// to count down to.
export function daysUntil(renewsOn: string): number {
  const target = new Date(`${renewsOn}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(renewsOn: string): string {
  return new Date(`${renewsOn}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MembershipCard({ planName, status, renewsOn, onCancel, onRenew, busy }: MembershipCardProps) {
  const remaining = daysUntil(renewsOn);
  const showCountdown = status !== "expired" && remaining >= 0 && remaining <= 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{planName}</CardTitle>
        <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
      </CardHeader>
      <p className="text-sm text-ink-muted">
        {status === "expired" ? "Expired on" : "Renews on"} {formatDate(renewsOn)}
      </p>
      {showCountdown && (
        <Badge tone="warning" className="mt-2">
          {status === "expiring"
            ? `Ends in ${remaining} ${remaining === 1 ? "day" : "days"} — we'll email you`
            : `Renews in ${remaining} ${remaining === 1 ? "day" : "days"} — we'll email you`}
        </Badge>
      )}
      {(onCancel || onRenew) && (
        <CardFooter>
          {status === "active" && onCancel && (
            <Button variant="secondary" size="sm" onClick={onCancel} disabled={busy}>
              {busy ? "Cancelling..." : "Cancel membership"}
            </Button>
          )}
          {status !== "active" && onRenew && (
            <Button size="sm" onClick={onRenew} disabled={busy}>
              {busy ? "Renewing..." : "Renew now"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}