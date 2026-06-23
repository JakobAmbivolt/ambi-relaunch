import type { ReactElement } from "react";
import { Container } from "@/components/ui/Container";

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
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-10 text-3xl font-bold text-ink md:text-4xl">{title}</h1>

          {sections.map((sec, si) => (
            <div key={si}>
              {sec.heading && (
                <h2 className="mt-8 mb-3 text-xl font-bold text-ink">{sec.heading}</h2>
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
        </div>
      </Container>
    </section>
  );
}
