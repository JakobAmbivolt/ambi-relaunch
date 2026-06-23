import type { Metadata } from "next";
import Image from "next/image";
import { unternehmen, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureList } from "@/components/sections/FeatureList";
import { ProgressBars } from "@/components/sections/ProgressBars";

export const metadata: Metadata = {
  title: unternehmen.metaTitle,
  description: unternehmen.metaDescription,
};

function decodeHtml(str: string) {
  return str.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

export default function UnternehmenPage() {
  const ueberUns = section(unternehmen, "ueber-uns");
  const nachhaltigkeit = section(unternehmen, "warum-wir-nachhaltigkeit");
  const verantwortung = section(unternehmen, "verantwortung-philosophie");

  return (
    <>
      <PageHero
        eyebrow={unternehmen.heroEyebrow}
        title={<Highlight color="amber">{unternehmen.heroTitle}</Highlight>}
        bgImage="/images/hero-bg.jpg"
        align="left"
      />

      {/* Über AmbiVolt */}
      {ueberUns && (
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left */}
              <div className="flex flex-col gap-6">
                <SectionHeading
                  eyebrow={ueberUns.subheading}
                  title={decodeHtml(ueberUns.heading ?? "")}
                />
                {ueberUns.paragraphs?.map((p, i) => (
                  <p key={i} className="text-text">
                    {p}
                  </p>
                ))}
                {ueberUns.bullets && ueberUns.bullets.length > 0 && (
                  <FeatureList items={ueberUns.bullets} />
                )}
                {ueberUns.cta?.href && (
                  <div>
                    <Button href={ueberUns.cta.href} variant="primary">
                      {ueberUns.cta.label}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right – Katalog cover */}
              {ueberUns.images?.[0] && (
                <div className="relative aspect-[3/4] w-full max-w-sm lg:max-w-none">
                  <Image
                    src={ueberUns.images[0]}
                    alt="AmbiVolt Katalog"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Nachhaltigkeit */}
      {nachhaltigkeit && (
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-col gap-6">
              <SectionHeading
                eyebrow={nachhaltigkeit.subheading}
                title={decodeHtml(nachhaltigkeit.heading ?? "")}
              />
              {nachhaltigkeit.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
              {nachhaltigkeit.cta?.href && (
                <div>
                  <Button href={nachhaltigkeit.cta.href} variant="secondary">
                    {nachhaltigkeit.cta.label}
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Verantwortung & Philosophie */}
      {verantwortung && (
        <section className="bg-slate-900 py-16 text-white md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-col gap-8">
              {verantwortung.heading && (
                <h2 className="text-2xl font-bold leading-snug md:text-3xl">
                  {decodeHtml(verantwortung.heading)}
                </h2>
              )}

              {verantwortung.bullets && verantwortung.bullets.length > 0 && (
                <ul className="space-y-3">
                  {verantwortung.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-white"
                          aria-hidden="true"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {unternehmen.progressBars && unternehmen.progressBars.length > 0 && (
                <ProgressBars items={unternehmen.progressBars} />
              )}

              {verantwortung.subheading && (
                <a
                  href="/kontakt/"
                  className="text-sm font-bold uppercase tracking-widest text-amber hover:text-amber-bright transition-colors"
                >
                  {verantwortung.subheading}
                </a>
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
