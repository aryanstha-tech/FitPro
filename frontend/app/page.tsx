import { Hero } from "@/components/home/Hero";
import { Facilities } from "@/components/home/Facilities";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero
        heading="Train with purpose."
        subheading="Full-access memberships, expert coaching and a floor built for serious training — join a community that shows up."
        imageSrc="/hero-gym.png"
        imageAlt="Member training with dumbbells at FitPro gym"
      />
      <Facilities />
      <CTA />
    </>
  );
}
