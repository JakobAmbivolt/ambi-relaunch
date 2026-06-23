import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { SpecialistSection } from "@/components/sections/SpecialistSection";
import { AdvantagesMarquee } from "@/components/sections/AdvantagesMarquee";
import { EfficiencyCards } from "@/components/sections/EfficiencyCards";
import { TechSection } from "@/components/sections/TechSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SeoTextBlock } from "@/components/sections/SeoTextBlock";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <SpecialistSection />
      <AdvantagesMarquee />
      <EfficiencyCards />
      <TechSection />
      <ProcessSteps />
      <SeoTextBlock />
      <CtaSection />
    </>
  );
}
