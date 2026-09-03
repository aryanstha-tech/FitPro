import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card>
      <span className="text-sm text-ink-muted">{label}</span>
      <div className="mt-2 font-display text-display-sm text-ink">{value}</div>
      {hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
    </Card>
  );
}
