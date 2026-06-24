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

const AMBER = "#dc9015";
const GREEN = "#268c45";

type Item = { label: string; percent: number };

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}

function Bar({
  progress,
  t0,
  t1,
  item,
  reduce,
}: {
  progress: MotionValue<number>;
  t0: number;
  t1: number;
  item: Item;
  reduce: boolean | null;
}) {
  const fill = useTransform(progress, [t0, t1], [0, 1]);
  const width = useTransform(fill, (v) => `${clamp01(v) * item.percent}%`);
  const bg = useTransform(fill, [0, 0.55, 1], [AMBER, AMBER, GREEN]);
  const pct = useTransform(fill, (v) => `${Math.round(clamp01(v) * item.percent)}`);
  const [full, setFull] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prevFull = useRef(false);

  useMotionValueEvent(fill, "change", (v) => {
    const f = v >= 0.99;
    if (f !== prevFull.current) {
      prevFull.current = f;
      setFull(f);
      if (f) setBurstKey((k) => k + 1);
    }
  });

  if (reduce) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-white">
          <span>{item.label}</span>
          <span style={{ color: GREEN }}>{item.percent}%</span>
        </div>
        <div className="h-2 w-full border border-white/20 bg-white/5">
          <div className="h-full" style={{ width: `${item.percent}%`, background: GREEN }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-white">
        <span>{item.label}</span>
        <span className="tabular-nums" style={{ color: full ? GREEN : AMBER }}>
          <motion.span>{pct}</motion.span>%
        </span>
      </div>
      <div className="relative h-2 w-full border border-white/20 bg-white/5">
        <motion.div className="h-full" style={{ width, background: bg }} />
        {full && burstKey > 0 && <CompletionBurst key={burstKey} />}
      </div>
    </div>
  );
}

export function ProgressBars({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const n = items.length;

  return (
    <div ref={ref} className="space-y-6">
      {items.map((item, i) => {
        const t0 = (i / n) * 0.55;
        return <Bar key={item.label} progress={progress} t0={t0} t1={t0 + 0.45} item={item} reduce={reduce} />;
      })}
    </div>
  );
}
