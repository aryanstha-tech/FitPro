import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function CTA() {
  return (
    <section className="border-t border-base-border bg-base-surface py-20">
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-lg">
          <h2 className="text-display-md text-ink">Ready to start training?</h2>
          <p className="mt-3 text-ink-muted">
            Join today and get your first personal training session on us.
          </p>
        </div>
        <Button size="lg" href="/register" className="cursor-pointer">Join Now</Button>
      </Container>
    </section>
  );
}
