"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

function renderBody(body: string) {
  const parts: React.ReactNode[] = [];
  const blocks = body.split(/\n\n+/);

  blocks.forEach((block, bi) => {
    const lines = block.split("\n");
    const hasBullets = lines.some((l) => l.startsWith("- "));

    if (hasBullets) {
      const listItems: React.ReactNode[] = [];
      const preBullets: string[] = [];

      lines.forEach((line, li) => {
        if (line.startsWith("- ")) {
          listItems.push(<li key={li}>{line.slice(2)}</li>);
        } else {
          preBullets.push(line);
        }
      });

      const preText = preBullets.filter(Boolean).join(" ");
      if (preText) {
        parts.push(
          <p key={`pre-${bi}`} className="mb-1">
            {preText}
          </p>
        );
      }
      parts.push(
        <ul key={`ul-${bi}`} className="my-2 list-disc pl-5 space-y-1">
          {listItems}
        </ul>
      );
    } else {
      lines.forEach((line, li) => {
        if (!line.trim()) return;
        if (line.endsWith(":")) {
          parts.push(
            <p key={`h-${bi}-${li}`} className="mt-3 mb-1 font-semibold text-ink">
              {line}
            </p>
          );
        } else {
          parts.push(
            <p key={`p-${bi}-${li}`} className="mb-1">
              {line}
            </p>
          );
        }
      });
    }
  });

  return parts;
}

export function JobAccordion({ jobs }: { jobs: { title: string; body: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
      {jobs.map((job, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-amber"
            >
              <span>{job.title}</span>
              <Icon
                name="chevron"
                className={`h-5 w-5 flex-shrink-0 text-amber transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-2 text-sm text-text leading-relaxed">
                {renderBody(job.body)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
