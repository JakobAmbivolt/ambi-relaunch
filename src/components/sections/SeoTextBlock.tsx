import { Container } from "@/components/ui/Container";
import { homeSeo } from "@/content/home";

export function SeoTextBlock() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-ink md:text-4xl">{homeSeo.title}</h2>
          <p className="mb-10 text-text">{homeSeo.intro}</p>

          <div className="space-y-10">
            {homeSeo.blocks.map((block) => (
              <div key={block.heading}>
                <h3 className="mb-4 text-xl font-bold text-ink">{block.heading}</h3>

                {block.paragraphs?.map((para, i) => (
                  <p key={i} className="mb-3 text-text">
                    {para}
                  </p>
                ))}

                {block.bullets && block.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {block.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-text">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
