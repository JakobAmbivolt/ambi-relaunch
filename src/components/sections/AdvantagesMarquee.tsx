import { Container } from "@/components/ui/Container";
import { homeAdvantages } from "@/content/home";

export function AdvantagesMarquee() {
  return (
    <div className="bg-amber py-5 text-white">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          {homeAdvantages.map((advantage, i) => (
            <div key={advantage} className="flex items-center gap-10">
              <span className="text-sm font-semibold uppercase tracking-widest">{advantage}</span>
              {i < homeAdvantages.length - 1 && (
                <span className="hidden text-white/50 sm:inline" aria-hidden="true">
                  •
                </span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
