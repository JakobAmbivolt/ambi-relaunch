import type { Metadata } from "next";
import Image from "next/image";
import { unternehmen, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Aurora } from "@/components/ui/Aurora";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { Reveal } from "@/components/ui/Reveal";
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
        title={unternehmen.heroTitle}
        bgImage="/images/hero-bg.jpg"
        align="left"
      />

      {/* Über AmbiVolt */}
      {ueberUns && (
        <section className="bg-white py-20 md:py-28">
          <Container>
            <Reveal>
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
                  <div className="relative aspect-[3/4] w-full max-w-sm border border-line lg:max-w-none">
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
            </Reveal>
          </Container>
        </section>
      )}

      {/* Nachhaltigkeit */}
      {nachhaltigkeit && (
        <section className="bg-surface py-20 md:py-28">
          <Container>
            <Reveal className="mx-auto max-w-3xl flex flex-col gap-6">
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
            </Reveal>
          </Container>
        </section>
      )}

      {/* Verantwortung & Philosophie */}
      {verantwortung && (
        <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-28">
          <div className="blueprint-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <ParallaxLayer from={60} to={-60}>
            <Aurora className="-right-32 -top-28" color="amber" size="40rem" opacity={0.14} />
            <Aurora className="-bottom-40 -left-32" color="green" size="34rem" opacity={0.1} />
          </ParallaxLayer>

          <Container className="relative z-10">
            <Reveal className="mx-auto max-w-3xl flex flex-col gap-8">
              {verantwortung.heading && (
                <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">
                  {decodeHtml(verantwortung.heading)}
                </h2>
              )}

              {verantwortung.bullets && verantwortung.bullets.length > 0 && (
                <ul className="space-y-3">
                  {verantwortung.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-green/40 bg-green/10">
                        <Icon name="check" className="h-3.5 w-3.5 text-green" />
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
                  className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber transition-colors hover:text-amber-bright"
                >
                  {verantwortung.subheading}
                </a>
              )}
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
