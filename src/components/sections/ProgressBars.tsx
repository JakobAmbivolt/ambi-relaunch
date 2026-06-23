"use client";

import { motion } from "motion/react";

export function ProgressBars({ items }: { items: { label: string; percent: number }[] }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm font-semibold text-white">
            <span>{item.label}</span>
            <span>{item.percent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-amber"
              initial={{ width: 0 }}
              whileInView={{ width: `${item.percent}%` }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
