import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { PdDownload } from "@/content/productDetails";

export function DownloadList({ downloads }: { downloads: PdDownload[] }) {
  if (!downloads.length) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Datenblätter" title="Downloads" className="mb-10" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
            {downloads.map((dl, i) => {
              const inner = (
                <>
                  {/* Dokument-Icon */}
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
                  <span>{dl.label}</span>
                </>
              );

              return dl.url ? (
                <a
                  key={i}
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-start gap-3 bg-white px-5 py-4 text-ink transition-colors hover:bg-surface hover:text-amber"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white px-5 py-4 text-text"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
