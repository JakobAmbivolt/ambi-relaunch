import { Container } from "@/components/ui/Container";
import { homeAdvantages } from "@/content/home";

export function AdvantagesMarquee() {
  return (
    <div className="bg-slate-900 py-5 text-white">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {homeAdvantages.map((advantage, i) => (
            <span key={advantage} className="flex items-center gap-8">
              <span className="text-sm font-semibold uppercase tracking-widest">
                {advantage}
              </span>
              {i < homeAdvantages.length - 1 && (
                <span className="text-amber text-lg leading-none" aria-hidden="true">
                  •
                </span>
              )}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}
