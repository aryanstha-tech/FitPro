import { Dumbbell, HeartPulse, Users, Waves } from "lucide-react";
import { Container } from "../layout/Container";
import { Card } from "../ui/Card";

const facilities = [
  {
    icon: Dumbbell,
    title: "Free weights & rigs",
    description: "Full range of plates, barbells and power racks — no waiting on machines.",
  },
  {
    icon: HeartPulse,
    title: "Cardio floor",
    description: "Rowers, bikes and treadmills with heart-rate tracking built in.",
  },
  {
    icon: Users,
    title: "Group classes",
    description: "HIIT, strength circuits and mobility sessions run daily.",
  },
  {
    icon: Waves,
    title: "Recovery suite",
    description: "Sauna, cold plunge and stretch zone for after your session.",
  },
];

export function Facilities() {
  return (
    <section className="bg-base py-24">
      <Container>
        <div className="max-w-lg">
          <h2 className="text-display-md text-ink">Everything you need, under one roof</h2>
          <p className="mt-4 text-ink-muted">
            One membership covers the full floor — no add-on fees for equipment
            or classes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <Icon className="text-accent" size={28} strokeWidth={1.5} />
              <h3 className="mt-5 text-base font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
