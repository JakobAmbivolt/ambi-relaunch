import type { ReactElement } from "react";
import { Container } from "@/components/ui/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MeasureLine } from "@/components/ui/MeasureLine";
import { Reveal } from "@/components/ui/Reveal";

type LegalSection = {
  heading?: string;
  body?: string;
  paragraphs?: string[];
};

// Linkify URLs in a plain text string into React nodes
function linkify(text: string): (string | ReactElement)[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: (string | ReactElement)[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    // trim trailing punctuation from URL
    const url = match[0].replace(/[.,;)]+$/, "");
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber underline hover:opacity-80 break-all"
      >
        {url}
      </a>
    );
    last = match.index + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// Render a single line of text — may contain URLs
function Line({ text }: { text: string }) {
  const parts = linkify(text);
  return <>{parts}</>;
}

// Render a body string: split by \n\n into paragraphs, \n into line breaks
// Lines starting with "- " become list items
function BodyText({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const allBullets = lines.length > 0 && lines.every((l) => l.startsWith("- "));

        if (allBullets) {
          return (
            <ul key={bi} className="mt-3 list-disc pl-6 space-y-1 text-text">
              {lines.map((l, li) => (
                <li key={li}>
                  <Line text={l.slice(2)} />
                </li>
              ))}
            </ul>
          );
        }

        // Plain paragraph with optional <br/> between lines
        return (
          <p key={bi} className="mt-3 text-text leading-relaxed">
            {lines.map((l, li) => (
              <span key={li}>
                <Line text={l} />
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

// Render an impressum paragraph[] entry: first line is bold subheading, rest is text with <br/>
function ImpressumParagraph({ text }: { text: string }) {
  const lines = text.split("\n");
  const [heading, ...rest] = lines;
  return (
    <div className="mt-5 text-text leading-relaxed">
      {heading && (
        <strong className="block font-semibold text-ink">
          <Line text={heading} />
        </strong>
      )}
      {rest.map((l, i) => (
        <span key={i}>
          <Line text={l} />
          {i < rest.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

export function LegalPageLayout({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  // Deterministische Section-Anker (Umlaut-sicher) für das Inhaltsverzeichnis.
  const sectionId = (i: number) => `abschnitt-${i + 1}`;
  const toc = sections
    .map((sec, si) => ({ heading: sec.heading, id: sectionId(si), index: si }))
    .filter((entry): entry is { heading: string; id: string; index: number } =>
      Boolean(entry.heading)
    );

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <header className="mx-auto max-w-3xl border-b border-line pb-8">
            <MonoLabel tone="amber">Rechtliches</MonoLabel>
            <h1 className="font-display mt-5 text-3xl font-bold leading-[1.05] text-ink md:text-5xl">
              {title}
            </h1>
            <MeasureLine className="mt-6" width="w-24" />
          </header>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
          {toc.length > 0 && (
            <Reveal className="hidden lg:block">
              <nav
                aria-label="Inhalt"
                className="sticky top-28 border-l border-line pl-5"
              >
                <p className="label-mono mb-4 text-text">Inhalt</p>
                <ol className="space-y-2.5">
                  {toc.map((entry) => (
                    <li key={entry.id} className="flex gap-3 text-sm leading-snug">
                      <span className="font-mono text-xs text-amber" aria-hidden="true">
                        {String(entry.index + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${entry.id}`}
                        className="text-text transition-colors hover:text-amber"
                      >
                        {entry.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          )}

          <Reveal delay={0.05} className="min-w-0 max-w-3xl">
            {sections.map((sec, si) => (
              <div
                key={si}
                id={sectionId(si)}
                className="scroll-mt-28 border-line py-8 first:pt-0 [&:not(:last-child)]:border-b"
              >
                {sec.heading && (
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-mono text-xs text-amber" aria-hidden="true">
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
                      {sec.heading}
                    </h2>
                  </div>
                )}
                {sec.body && <BodyText text={sec.body} />}
                {sec.paragraphs && sec.paragraphs.length > 0 && (
                  <div>
                    {sec.paragraphs.map((p, pi) => (
                      <ImpressumParagraph key={pi} text={p} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
