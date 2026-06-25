"use client";

import { useState } from "react";

// Datenschutzfreundliche YouTube-Einbindung (Klick-zum-Laden): Vor dem Klick
// werden KEINE Daten an Google übertragen. Erst der Klick lädt das nocookie-iframe.
export function YouTubeFacade({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-line bg-slate-900">
      {loaded ? (
        <iframe
          src={`${url}?autoplay=1&rel=0`}
          title={`YouTube-Video: ${title}`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group/yt absolute inset-0 flex flex-col items-center justify-center gap-3 text-center"
          aria-label={`Video abspielen: ${title} (lädt YouTube)`}
        >
          <span
            className="blueprint-dark pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <span className="relative flex h-14 w-14 items-center justify-center bg-amber text-white transition-transform duration-200 group-hover/yt:scale-110">
            <svg viewBox="0 0 24 24" width="24" height="24" className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="relative font-mono text-xs uppercase tracking-[0.16em] text-white">
            Video abspielen
          </span>
          <span className="relative max-w-xs px-4 font-mono text-[0.6rem] leading-relaxed tracking-[0.04em] text-white/55">
            Mit Klick wird YouTube (Google) geladen. Dabei können Daten an Google übertragen werden.
          </span>
        </button>
      )}
    </div>
  );
}
