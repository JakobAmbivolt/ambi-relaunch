"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Project = { name: string; image: string | null; kwp?: string };

function Lightbox({
  projects,
  startIndex,
  onClose,
}: {
  projects: Project[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const current = projects[index];

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + projects.length) % projects.length),
    [projects.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % projects.length),
    [projects.length]
  );

  // Move focus to close button whenever the lightbox opens or the slide changes.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  // Focus trap: cycle focus among Prev, Next, Close buttons.
  function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusable = [prevButtonRef.current, nextButtonRef.current, closeButtonRef.current].filter(
      (el): el is HTMLButtonElement => el !== null
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      onKeyDown={handleDialogKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Projektbild"
    >
      {/* prev */}
      <button
        ref={prevButtonRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 border border-white/20 bg-white/10 p-3 text-white transition-colors hover:border-amber hover:bg-white/20"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Vorheriges Bild"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* image */}
      <div
        className="relative mx-16 max-h-[80vh] max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {current.image ? (
          <Image
            src={current.image}
            alt={current.name}
            width={1200}
            height={800}
            className="max-h-[70vh] w-full border border-white/15 object-contain"
          />
        ) : (
          <div className="flex h-64 items-center justify-center border border-white/15 bg-slate-800 text-white">
            Kein Bild verfügbar
          </div>
        )}
        <p className="mt-3 text-center font-mono text-sm font-semibold text-white">
          {current.name}{current.kwp ? ` · ${current.kwp}` : ""}
        </p>
      </div>

      {/* next */}
      <button
        ref={nextButtonRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 border border-white/20 bg-white/10 p-3 text-white transition-colors hover:border-amber hover:bg-white/20"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Nächstes Bild"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* close */}
      <button
        ref={closeButtonRef}
        className="absolute right-4 top-4 border border-white/20 bg-white/10 p-2 text-white transition-colors hover:border-amber hover:bg-white/20"
        onClick={onClose}
        aria-label="Schließen"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ReferenceGallery({ projects }: { projects: Project[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="referenzen" className="bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
            {projects.map((project, i) => (
              <button
                key={`${project.name}-${i}`}
                onClick={() => setLightboxIndex(i)}
                className="group relative aspect-[4/3] overflow-hidden bg-surface focus-visible:outline-2 focus-visible:outline-amber"
                aria-label={`${project.name}${project.kwp ? ` · ${project.kwp}` : ""} vergrößern`}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface font-mono text-xs uppercase tracking-wide text-text/60">
                    Kein Bild
                  </div>
                )}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-amber opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="font-mono text-xs font-semibold text-white">
                    {project.name}{project.kwp ? ` · ${project.kwp}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      </Container>

      {lightboxIndex !== null && (
        <Lightbox
          projects={projects}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
