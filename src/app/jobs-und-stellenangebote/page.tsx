import type { Metadata } from "next";
import Image from "next/image";
import { jobsPage, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { BenefitGrid } from "@/components/sections/BenefitGrid";
import { JobAccordion } from "@/components/sections/JobAccordion";
import { ContactInfo } from "@/components/ui/ContactInfo";

export const metadata: Metadata = {
  title: jobsPage.metaTitle,
  description: jobsPage.metaDescription,
};

export default function JobsPage() {
  const intro = section(jobsPage, "intro");
  const gemeinsam = section(jobsPage, "gemeinsam");
  const benefitsSection = section(jobsPage, "benefits");
  const stellenangebote = section(jobsPage, "stellenangebote");
  const bewerbungsprozess = section(jobsPage, "bewerbungsprozess");
  const ctaBewerben = section(jobsPage, "cta-bewerben");

  return (
    <>
      <PageHero
        eyebrow={jobsPage.heroEyebrow}
        title={<Highlight color="amber">{jobsPage.heroTitle}</Highlight>}
        bgImage="/images/hero-bg.jpg"
        align="left"
      >
        <div className="mt-6">
          <Button href="#offene-stellenangebote" variant="primary">
            Jobs entdecken
          </Button>
        </div>
      </PageHero>

      {/* Intro */}
      {intro && (
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-col gap-6">
              <SectionHeading
                eyebrow={intro.subheading}
                title={intro.heading ?? ""}
              />
              {intro.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Gemeinsam mehr erreichen */}
      {gemeinsam && (
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              {/* Text */}
              <div className="flex flex-col gap-6">
                <SectionHeading
                  eyebrow={gemeinsam.subheading}
                  title={gemeinsam.heading ?? ""}
                />
                {gemeinsam.paragraphs?.map((p, i) => (
                  <p key={i} className="text-text">
                    {p}
                  </p>
                ))}
              </div>

              {/* Image collage */}
              {gemeinsam.images && gemeinsam.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {gemeinsam.images[0] && (
                    <div className="relative col-span-2 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={gemeinsam.images[0]}
                        alt="Jobs bei AmbiVolt"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  {gemeinsam.images[1] && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={gemeinsam.images[1]}
                        alt="Karriere bei AmbiVolt"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  {gemeinsam.images[2] && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={gemeinsam.images[2]}
                        alt="Team bei AmbiVolt"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Benefits */}
      {jobsPage.benefits && jobsPage.benefits.length > 0 && (
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="flex flex-col gap-10">
              <SectionHeading
                title={benefitsSection?.heading ?? "Bei Ambivolt erhältst du mehr als nur einen Job!"}
                align="center"
              />
              <BenefitGrid items={jobsPage.benefits} />
            </div>
          </Container>
        </section>
      )}

      {/* Aktuelle Stellenangebote */}
      <section id="offene-stellenangebote" className="bg-white py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow={stellenangebote?.subheading}
              title={stellenangebote?.heading ?? "Aktuelle Stellenangebote"}
            />
            {jobsPage.jobs && jobsPage.jobs.length > 0 && (
              <JobAccordion jobs={jobsPage.jobs} />
            )}
          </div>
        </Container>
      </section>

      {/* Bewerbungsprozess */}
      {bewerbungsprozess && (
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-col gap-8">
              <SectionHeading
                eyebrow={bewerbungsprozess.subheading}
                title={bewerbungsprozess.heading ?? ""}
              />
              {bewerbungsprozess.bullets && bewerbungsprozess.bullets.length > 0 && (
                <ol className="space-y-6">
                  {bewerbungsprozess.bullets.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-text">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
              {bewerbungsprozess.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Bewerben */}
      {ctaBewerben && (
        <section className="bg-slate-900 py-16 text-white md:py-24">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-col items-center gap-8 text-center">
              {ctaBewerben.heading && (
                <h2 className="text-2xl font-bold md:text-3xl">{ctaBewerben.heading}</h2>
              )}
              {ctaBewerben.paragraphs?.map((p, i) => (
                <p key={i} className="text-white/80">
                  {p}
                </p>
              ))}
              <Button href="/jetzt-bewerben/" variant="primary">
                Jetzt bewerben!
              </Button>
              <div className="text-white/80">
                <ContactInfo />
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
