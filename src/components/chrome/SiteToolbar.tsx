"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSiteExperience } from "@/context/SiteExperienceContext";

export function SiteToolbar() {
  const {
    sceneTheme,
    setSceneTheme,
    reading,
    setReading,
    lowBandwidth,
    setLowBandwidth,
    soundEnabled,
    setSoundEnabled,
  } = useSiteExperience();

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-gold-500/25 bg-bg-panel/90 px-3 py-2 shadow-xl backdrop-blur-md">
      <span className="hidden text-[10px] text-muted sm:inline">وضع المشهد</span>
      <button suppressHydrationWarning
        type="button"
        onClick={() => setSceneTheme(sceneTheme === "day" ? "night" : "day")}
        className="rounded-full border border-gold-500/30 px-3 py-1 text-[11px] text-foreground transition hover:border-gold-400"
        aria-pressed={sceneTheme === "day"}
      >
        {sceneTheme === "day" ? "نهاري" : "ليلي"}
      </button>
      <button suppressHydrationWarning
        type="button"
        onClick={() =>
          setReading({ largerText: !reading.largerText, contrastBoost: true })
        }
        className="rounded-full border border-gold-500/30 px-3 py-1 text-[11px] text-foreground hover:border-gold-400"
        aria-pressed={reading.largerText}
      >
        قراءة مريحة
      </button>
      <button suppressHydrationWarning
        type="button"
        onClick={() => setLowBandwidth(!lowBandwidth)}
        className="rounded-full border border-gold-500/30 px-3 py-1 text-[11px] text-foreground hover:border-gold-400"
        aria-pressed={lowBandwidth}
      >
        توفير بيانات
      </button>
      <button suppressHydrationWarning
        type="button"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="rounded-full border border-gold-500/30 px-3 py-1 text-[11px] text-foreground hover:border-gold-400"
        aria-pressed={soundEnabled}
      >
        صوت بيئة
      </button>
      <Link
        href="/vip"
        prefetch
        className="rounded-full bg-gold-500/90 px-3 py-1 text-[11px] font-semibold text-bg-deep hover:bg-gold-400"
      >
        VIP
      </Link>
      <span className="hidden text-[10px] text-muted/70 md:inline">
        Alt+1..4 أقسام
      </span>
    </div>
  );
}
