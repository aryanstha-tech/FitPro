import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "About Us — FitPro" };

const values = [
  {
    number: "01",
    title: "Coached, not just equipped",
    description: "Every member gets a check-in with a coach in their first week.",
  },
  {
    number: "02",
    title: "No hidden fees",
    description: "One membership price. Classes, equipment and the recovery suite included.",
  },
  {
    number: "03",
    title: "Open early, open late",
    description: "4am–9pm, seven days a week, so training fits your schedule.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24 pt-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="accent">Our story</Badge>
            <h1 className="mt-4 text-display-md md:text-display-lg text-ink">
              Built by lifters, for lifters
            </h1>
            <p className="mt-5 max-w-md text-ink-muted">
              FitPro started as a single warehouse floor in 2026. Today it's a
              community of members who show up because the space,
              the equipment and the coaching are worth it — not because of a
              contract.
            </p>
            <Button href="/membership" className="mt-8">
              See membership plans
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-base-raised shadow-glow">
            <Image src="/gym-floor.webp" alt="FitPro gym floor" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title}>
              <span className="text-sm font-bold text-accent">{value.number}</span>
              <h3 className="mt-3 text-base font-medium text-ink">{value.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{value.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}