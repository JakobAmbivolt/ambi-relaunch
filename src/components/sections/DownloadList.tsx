import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { PdDownload } from "@/content/productDetails";

export function DownloadList({ downloads }: { downloads: PdDownload[] }) {
  if (!downloads.length) return null;

  return (
    <section className="bg-white py-12">
      <Container>
        <SectionHeading title="Downloads" className="mb-8" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {downloads.map((dl, i) => (
            <div key={i} className="flex items-start gap-3">
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

              {dl.url ? (
                <a
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-ink hover:text-amber transition-colors"
                >
                  {dl.label}
                </a>
              ) : (
                <span className="text-text">{dl.label}</span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
