"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Gold Progress Indicator that fills up as the user scrolls down
 * Matches the reference Awwwards requirements
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, var(--gold-300), var(--gold-500))",
        zIndex: 9999,
        boxShadow: "0 0 10px rgba(201, 168, 76, 0.5)",
      }}
      aria-hidden="true"
    />
  );
}
