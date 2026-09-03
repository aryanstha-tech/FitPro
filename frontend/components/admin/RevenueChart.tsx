interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="flex h-56 items-end gap-4 rounded-card border border-base-border bg-base-surface p-6">
      {data.map((point) => (
        <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-control bg-accent/80 transition-all"
            style={{ height: `${(point.revenue / max) * 100}%` }}
            title={`$${point.revenue.toLocaleString()}`}
          />
          <span className="text-xs text-ink-faint">{point.month}</span>
        </div>
      ))}
    </div>
  );
}
