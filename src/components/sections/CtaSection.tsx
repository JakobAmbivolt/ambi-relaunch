import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { homeCta } from "@/content/home";

export function CtaSection() {
  return (
    <section className="bg-slate-900 py-16 md:py-24 text-white">
      <Container>
        <div className="flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl">{homeCta.title}</h2>
          <p className="text-lg font-semibold text-amber uppercase tracking-widest">
            {homeCta.slogan}
          </p>
          <Button href={homeCta.button.href} variant="primary">
            {homeCta.button.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
