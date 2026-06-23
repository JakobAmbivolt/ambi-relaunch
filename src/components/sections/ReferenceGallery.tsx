"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + projects.length) % projects.length),
    [projects.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % projects.length),
    [projects.length]
  );

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Referenz ${current.name}`}
    >
      {/* prev */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/40 transition-colors"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Vorheriges Bild"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
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
            className="max-h-[70vh] w-full object-contain"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-slate-800 text-white">
            Kein Bild verfügbar
          </div>
        )}
        <p className="mt-3 text-center text-sm font-semibold text-white">
          {current.name}{current.kwp ? ` · ${current.kwp}` : ""}
        </p>
      </div>

      {/* next */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/40 transition-colors"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Nächstes Bild"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* close */}
      <button
        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
        onClick={onClose}
        aria-label="Schließen"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ReferenceGallery({ projects }: { projects: Project[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="referenzen" className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 md:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project, i) => (
            <button
              key={`${project.name}-${i}`}
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden rounded-lg bg-slate-100 aspect-[4/3] focus-visible:outline-2 focus-visible:outline-amber"
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
                <div className="flex h-full items-center justify-center bg-slate-200 text-sm text-slate-500">
                  Kein Bild
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="text-xs font-semibold text-white">
                  {project.name}{project.kwp ? ` · ${project.kwp}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

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
