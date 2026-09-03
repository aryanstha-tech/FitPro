import Image from "next/image";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

interface HeroProps {
  eyebrow?: string;
  heading: string;
  subheading: string;
  imageSrc: string;
  imageAlt: string;
}

export function Hero({ heading, subheading, imageSrc, imageAlt }: HeroProps) {
  return (
    <section className="relative flex min-h-[640px] items-end overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center"
      />
      {/* Left-to-right dark gradient so text stays legible over the photo,
          matching the reference's contrast treatment. */}
      <div className="absolute inset-0 bg-gradient-to-r from-base/95 via-base/40 to-transparent" />

      <Container className="relative pb-20 pt-40">
        <div className="max-w-xl">
          <h1 className="text-display-md md:text-display-lg text-ink">{heading}</h1>
          <p className="mt-5 max-w-md text-base text-ink-muted">{subheading}</p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" href="/register">
              Join Now
            </Button>
            <Button size="lg" variant="secondary" href="/membership">
              View Membership
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
