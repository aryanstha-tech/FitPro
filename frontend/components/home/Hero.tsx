import Image from "next/image";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import {
  UsersRound,
  Dumbbell,
  CalendarCheck,
  Target,
} from "lucide-react";
import { Icon } from "@iconify/react";

interface HeroProps {
  heading: React.ReactNode;
  subheading: string;
  imageSrc: string;
  imageAlt: string;
}

export function Hero({
  heading,
  subheading,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <section className="relative min-h-[730px] overflow-hidden bg-black">
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-[center_20%]"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />

      {/* Hero Content */}
      <Container className="relative z-10 flex min-h-[750px] items-center">
        <div className="max-w-xl">
          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {heading}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/50">
            {subheading}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              href="/membership"
              className="cursor-pointer"
            >
              Explore Membership
            </Button>

            <Button
              size="lg"
              variant="secondary"
              href="/about"
              className="cursor-pointer !border-accent !text-accent hover:!bg-accent hover:!text-base"
            >
              Explore Gym
            </Button>
          </div>

          {/* Rating */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="h-9 w-9 rounded-full border-2 border-black bg-white/20" />
              <div className="h-9 w-9 rounded-full border-2 border-black bg-white/30" />
              <div className="h-9 w-9 rounded-full border-2 border-black bg-white/40" />
            </div>

            <div>
              <div className="flex items-center gap-1 text-sm text-white">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9</span>
              </div>

              <p className="text-xs text-white/50">
                Based on customer reviews
              </p>
            </div>
          </div>
        </div>
      </Container>

{/* Feature Cards */}
<div className="absolute bottom-8 left-1/2 z-20 grid w-[90%] max-w-5xl -translate-x-1/2 grid-cols-2 gap-4 md:grid-cols-4">
  <FeatureCard
    title="Expert Trainers"
    icon={<UsersRound size={17} />}
  />

  <FeatureCard
    title="Modern Equipment"
    icon={<Dumbbell size={17} />}
  />

  <FeatureCard
    title="Flexible Membership"
    icon={<CalendarCheck size={17} />}
  />

  <FeatureCard
    title="Personalized Training"
    icon={<Target size={17} />}
  />
</div>
    </section>
  );
}

function FeatureCard({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-lg">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-accent">
        {icon}
      </div>

      <p className="mt-6 text-sm font-semibold text-black">
        {title}
      </p>
    </div>
  );
}