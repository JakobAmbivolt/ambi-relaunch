"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { CompletionBurst } from "@/components/ui/CompletionBurst";

const COLS = 10;
const ROWS = 5;
const MAX_ORDER = COLS - 1 + (ROWS - 1);

const EMPTY = "#211f2c";
const CHARGING = "#dc9015"; // amber
const CHARGED = "#268c45"; // grün

function Cell({ progress, order }: { progress: MotionValue<number>; order: number }) {
  // Diagonale Ladefront: jede Zelle startet etwas später (oben-links → unten-rechts)
  const t0 = order * 0.62;
  const t1 = Math.min(t0 + 0.34, 1);
  const mid = t0 + (t1 - t0) * 0.55;

  const backgroundColor = useTransform(progress, [t0, mid, t1], [EMPTY, CHARGING, CHARGED]);
  const boxShadow = useTransform(
    progress,
    [t0, mid, t1],
    [
      "0 0 0 rgba(0,0,0,0)",
      "0 0 14px rgba(239,145,9,0.55)",
      "0 0 9px rgba(38,140,69,0.40)",
    ],
  );

  return (
    <motion.div
      className="relative h-full w-full rounded-[2px]"
      style={{ backgroundColor, boxShadow }}
    >
      {/* dezente Solarzellen-Busbar */}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/15" />
    </motion.div>
  );
}

export function SolarChargePanel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [charged, setCharged] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prevCharged = useRef(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.3"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  // Ladung erreicht 100% etwas früher (bei ~70% Scroll), solange das Panel noch gut sichtbar ist.
  const charge = useTransform(progress, [0, 0.7], [0, 1]);

  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  const pct = useTransform(charge, (v) => `${Math.round(clamp(v) * 100)}`);
  const watt = useTransform(charge, (v) => `${Math.round(clamp(v) * 440)}`);
  const barWidth = useTransform(charge, [0, 1], ["0%", "100%"]);
  const scanLeft = useTransform(charge, [0, 1], ["0%", "100%"]);
  const scanOpacity = useTransform(charge, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  const panelGlow = useTransform(
    charge,
    [0, 0.5, 1],
    [
      "0 0 0px 0px rgba(0,0,0,0)",
      "0 0 40px -6px rgba(239,145,9,0.30)",
      "0 0 55px -4px rgba(38,140,69,0.42)",
    ],
  );

  useMotionValueEvent(charge, "change", (v) => {
    const next = v >= 0.985;
    if (next !== prevCharged.current) {
      prevCharged.current = next;
      setCharged(next);
      if (next) setBurstKey((k) => k + 1);
    }
  });

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    return (c + r) / MAX_ORDER;
  });

  // Reduced-Motion / SSR-freundlicher Fallback: voll geladenes Panel, keine Scroll-Bindung
  if (reduce) {
    return (
      <div className="w-full" aria-hidden="true">
        <div className="rounded-md border border-white/10 bg-slate-900 p-3 shadow-2xl">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {cells.map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[2px]"
                style={{ backgroundColor: CHARGED }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-green">
          <span>Ladung 100 %</span>
          <span>Einspeisebereit</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="w-full" aria-hidden="true">
      <div className="relative">
      <motion.div
        className="relative overflow-hidden rounded-md border border-white/10 bg-slate-900 p-3"
        style={{ boxShadow: panelGlow }}
      >
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {cells.map((order, i) => (
            <div key={i} className="aspect-square">
              <Cell progress={charge} order={order} />
            </div>
          ))}
        </div>

        {/* Laser-Scan, der die Ladefront begleitet */}
        <motion.span
          className="pointer-events-none absolute inset-y-2 w-[2px] bg-amber"
          style={{ left: scanLeft, opacity: scanOpacity }}
        />
      </motion.div>
        {charged && burstKey > 0 && <CompletionBurst key={burstKey} />}
      </div>

      {/* Dashboard-Ladeanzeige */}
      <div className="mt-5">
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 font-mono">
          <div className="bg-slate-900 px-4 py-3">
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/45">Ladung</span>
            <div
              className="mt-1 text-2xl font-bold tabular-nums"
              style={{ color: charged ? CHARGED : CHARGING }}
            >
              <motion.span>{pct}</motion.span>
              <span className="ml-0.5 text-base">%</span>
            </div>
          </div>
          <div className="bg-slate-900 px-4 py-3">
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/45">Leistung</span>
            <div className="mt-1 text-2xl font-bold tabular-nums text-white">
              <motion.span>{watt}</motion.span>
              <span className="ml-1 text-base text-white/55">Wp</span>
            </div>
          </div>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full"
            style={{ width: barWidth, backgroundColor: charged ? CHARGED : CHARGING }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45">
          <span>Photovoltaik-Ertrag</span>
          <span style={{ color: charged ? CHARGED : "rgba(255,255,255,0.45)" }}>
            {charged ? "Einspeisebereit" : "Lädt …"}
          </span>
        </div>
      </div>
    </div>
  );
}
