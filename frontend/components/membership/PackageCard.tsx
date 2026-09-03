import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { Package } from "@/lib/mock-data";
import clsx from "clsx";

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Card
      className={clsx(
        "flex flex-col",
        pkg.featured && "border-accent/60 shadow-glow"
      )}
    >
      <CardHeader>
        <CardTitle>{pkg.name}</CardTitle>
        {pkg.featured && <Badge tone="accent">Most popular</Badge>}
      </CardHeader>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-display-md text-ink">${pkg.price}</span>
        <span className="text-sm text-ink-muted">/{pkg.billing}</span>
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {pkg.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-sm text-ink-muted">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            {perk}
          </li>
        ))}
      </ul>

      <CardFooter>
        <Button variant={pkg.featured ? "primary" : "secondary"} className="w-full">
          Choose {pkg.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
