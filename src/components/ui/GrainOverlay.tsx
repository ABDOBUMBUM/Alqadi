"use client";

import { motion } from "framer-motion";
import { useSiteExperience } from "@/context/SiteExperienceContext";

export function GrainOverlay() {
  const { colorMode } = useSiteExperience();
  const targetOpacity = colorMode === "light" ? 0.18 : 0.4;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: targetOpacity }}
      transition={{ duration: 2 }}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: colorMode === "light" ? "multiply" : "overlay",
      }}
      aria-hidden="true"
    />
  );
}
