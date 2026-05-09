"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useSiteExperience } from "@/context/SiteExperienceContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { colorMode, toggleColorMode } = useSiteExperience();
  const isLight = colorMode === "light";

  return (
    <motion.button
      suppressHydrationWarning
      type="button"
      onClick={toggleColorMode}
      aria-label={isLight ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
      aria-pressed={isLight}
      whileTap={{ scale: 0.88 }}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
        isLight
          ? "border-amber-300/60 bg-amber-50 text-amber-600 hover:bg-amber-100"
          : "border-gold-500/30 bg-white/5 text-gold-400 hover:bg-white/10"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
