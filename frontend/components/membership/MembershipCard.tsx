import { Card, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface MembershipCardProps {
  planName: string;
  status: "active" | "expiring" | "expired";
  renewsOn: string;
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

export function MembershipCard({ planName, status, renewsOn }: MembershipCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{planName}</CardTitle>
        <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
      </CardHeader>
      <p className="text-sm text-ink-muted">
        {status === "expired" ? "Expired on" : "Renews on"} {renewsOn}
      </p>
      <CardFooter>
        <Button variant="secondary" size="sm">
          Manage plan
        </Button>
        {status !== "active" && (
          <Button size="sm">Renew now</Button>
        )}
      </CardFooter>
    </Card>
  );
}
