"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto max-w-6xl px-5 py-28 md:px-10 md:py-36 ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={fadeUp}
        className="gold-border rounded-3xl border border-gold-500/20 bg-bg-panel/55 p-8 shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-14"
      >
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-gold-500/90">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-bold leading-snug text-foreground md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </motion.div>
    </section>
  );
}
