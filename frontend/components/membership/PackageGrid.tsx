"use client";

import { useRouter } from "next/navigation";
import { PackageCard } from "./PackageCard";
import { useSwitchPlan } from "@/lib/use-switch-plan";
import type { Package as MockPackage } from "@/lib/mock-data";

interface PackageGridProps {
  packages: MockPackage[];
}

export function PackageGrid({ packages }: PackageGridProps) {
  const router = useRouter();
  const { switchPlan, switchingId, error } = useSwitchPlan(() => router.push("/dashboard/membership"));

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onChoose={() => switchPlan(pkg.id)}
            loading={switchingId === pkg.id}
          />
        ))}
      </div>
    </div>
  );
}