import Image from "next/image";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "About Us — FitPro" };

const values = [
  {
    title: "Coached, not just equipped",
    description: "Every member gets a check-in with a coach in their first week.",
  },
  {
    title: "No hidden fees",
    description: "One membership price. Classes, equipment and the recovery suite included.",
  },
  {
    title: "Open early, open late",
    description: "5am–11pm, seven days a week, so training fits your schedule.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24 pt-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-display-md md:text-display-lg text-ink">Built by lifters, for lifters</h1>
            <p className="mt-5 max-w-md text-ink-muted">
              FitPro started as a single warehouse floor in 2018. Today it's a
              community of members who show up because the space, the
              equipment and the coaching are worth it — not because of a
              contract.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-base-raised">
            <Image src="/hero-gym.jpg" alt="FitPro gym floor" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <h3 className="text-base font-medium text-ink">{value.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
