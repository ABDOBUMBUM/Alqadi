"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
};

export function GlassPanel({ children, className = "", hoverGlow }: Props) {
  return (
    <motion.div
      whileHover={
        hoverGlow
          ? { boxShadow: "0 0 48px rgba(232, 197, 71, 0.18)", y: -2 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`gold-border rounded-3xl border border-gold-500/20 bg-bg-panel/50 p-6 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
