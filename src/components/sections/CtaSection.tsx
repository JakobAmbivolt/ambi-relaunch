import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { homeCta } from "@/content/home";

export function CtaSection() {
  return (
    <section className="bg-slate-900 py-16 text-white md:py-24">
      <Container>
        <div className="flex flex-col items-center gap-7 text-center">
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">{homeCta.title}</h2>
          <p className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold md:text-4xl">
            {homeCta.sloganParts.map((part, i) => (
              <Highlight key={i} color={part.color}>
                {part.text}
              </Highlight>
            ))}
          </p>
          <Button href={homeCta.button.href} variant="primary">
            {homeCta.button.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
