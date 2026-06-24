import { Hero } from "@/components/sections/Hero";
import { EfficiencyCards } from "@/components/sections/EfficiencyCards";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { ValueSection } from "@/components/sections/ValueSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SeoTextBlock } from "@/components/sections/SeoTextBlock";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <EfficiencyCards />
      <ProductGrid />
      <ValueSection />
      <ProcessSteps />
      <SeoTextBlock />
      <CtaSection />
    </>
  );
}
