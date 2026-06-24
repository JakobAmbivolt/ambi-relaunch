import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";

export const metadata: Metadata = {
  title: "AGB & Widerrufsbelehrung",
  robots: { index: false, follow: true },
};

const downloads = [
  {
    label: "Allgemeine Geschäftsbedingungen",
    note: "Unsere aktuellen AGB als PDF.",
    href: "/dokumente/agb.pdf",
  },
  {
    label: "Muster-Widerrufsformular",
    note: "Formular zur Ausübung Ihres Widerrufsrechts als PDF.",
    href: "/dokumente/widerrufsformular.pdf",
  },
];

function DocIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function AgbPage() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <header className="mx-auto max-w-3xl border-b border-line pb-8">
            <MonoLabel tone="amber">Rechtliches</MonoLabel>
            <h1 className="font-display mt-5 text-3xl font-bold leading-[1.05] text-ink hyphens-auto break-words md:text-5xl">
              AGB &amp; Widerrufsbelehrung
            </h1>
            <MeasureLine className="mt-6" width="w-24" />
          </header>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto mt-10 max-w-3xl">
          <p className="text-text">
            Unsere aktuellen Allgemeinen Geschäftsbedingungen sowie das Muster-Widerrufsformular
            stellen wir Ihnen hier als PDF zum Download bereit.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
            {downloads.map((dl) => (
              <a
                key={dl.href}
                href={dl.href}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group flex items-start gap-3 bg-white px-5 py-5 transition-colors hover:bg-surface"
              >
                <DocIcon />
                <span>
                  <span className="font-display font-bold text-ink transition-colors group-hover:text-amber">
                    {dl.label}
                  </span>
                  <span className="mt-1 block text-sm text-text">{dl.note}</span>
                  <span className="mt-2 block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-amber">
                    PDF herunterladen →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
