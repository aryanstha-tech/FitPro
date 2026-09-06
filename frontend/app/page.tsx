import { Hero } from "@/components/home/Hero";
import { Facilities } from "@/components/home/Facilities";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero
        heading={
          <>  
            Achieve Your <br /> 
      <span className="text-accent">Fitness Dreams</span>
          </>
        }
        subheading="Through personalized coaching, cutting-edge techniques
                   and support we will help you achieve the fitness goals you
                   have always wanted."
        imageSrc="/hero-gym.png"
        imageAlt="Member training with dumbbells at FitPro gym"
      />
      <Facilities />
      <CTA />
    </>
  );
}
