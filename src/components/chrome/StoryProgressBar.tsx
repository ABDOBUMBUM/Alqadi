"use client";

import { motion } from "framer-motion";
import { STORY_PHASES } from "@/hooks/useStoryPhases";

type Props = {
  scroll: number;
  phaseIndex: number;
};

export function StoryProgressBar({ scroll, phaseIndex }: Props) {
  return (
    <div
      className="pointer-events-auto fixed left-0 right-0 top-0 z-50 h-1 bg-bg-deep/80 backdrop-blur"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(scroll * 100)}
      aria-label="عمق التمرير في القصة"
    >
      <motion.div
        className="h-full bg-gradient-to-l from-gold-600 via-gold-400 to-gold-500"
        style={{ width: `${scroll * 100}%` }}
        layout
      />
      <div className="pointer-events-none absolute inset-x-0 top-1 flex justify-between px-2 text-[10px] text-muted/80">
        {STORY_PHASES.map((p, i) => (
          <span
            key={p.id}
            className={
              i === phaseIndex ? "font-semibold text-gold-400" : "opacity-60"
            }
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
