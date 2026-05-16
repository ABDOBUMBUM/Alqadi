"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plane, ShieldCheck, Map, Clock } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useEffect, useState } from "react";

type HeroStat = { label?: string; sub?: string };
type HomeCms = {
  heroBadge?: string;
  heroMainTitle?: string;
  heroMainSubtitle?: string;
  heroMainImage?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  heroStats?: HeroStat[];
};
type HeroText = {
  company?: { nameAr?: string };
  cms_home?: HomeCms;
};

export function Hero3D() {
  const [homeCms, setHomeCms] = useState<HomeCms | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: HeroText) => setHomeCms(data.cms_home || null))
      .catch(() => setHomeCms(null));
  }, []);

  const source = Array.isArray(homeCms?.heroStats) && homeCms?.heroStats?.length
    ? homeCms.heroStats
    : [
        { label: "حجوزات طيران", sub: "أفضل الأسعار" },
        { label: "خدمات متكاملة", sub: "حلول شاملة" },
        { label: "برامج سياحية", sub: "تجارب فريدة" },
        { label: "دعم 24/7", sub: "خدمة عملاء" },
      ];
  const stats = source.slice(0, 4);

  const text = (value: string | undefined, fallback: string) => value || fallback;

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black"
      aria-label="القسم الرئيسي — مجموعة القاضي"
    >
      {/* ══════════════════════════════════════════════
          FULL-SCREEN BACKGROUND IMAGE
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <Image
          src={text(homeCms?.heroMainImage, "/assets/background.jpg")}
          alt={text(homeCms?.heroMainTitle, "مجموعة القاضي الذهبية")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* ══════════════════════════════════════════════
          TOP BADGE
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center pt-32 px-6 pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="inline-block px-5 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md"
        >
          {text(homeCms?.heroBadge, "مجموعة القاضي الذهبية · الكويت")}
        </motion.span>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM OVERLAY — text + CTAs + stats
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-6">
        {/* Gradient veil so text is readable over the 3D scene */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-center"
          >
            <h1
              className="font-black leading-tight mb-3"
              style={{
                fontFamily: "var(--font-cairo), sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
              }}
            >
              <TextReveal
                text={text(homeCms?.heroMainTitle, "سافر بثقة · نرتقي بتجربتك")}
                className="justify-center text-transparent bg-clip-text"
                style={{
                  background:
                    "linear-gradient(120deg, #ffffff 0%, #fffbea 30%, var(--gold-300) 60%, #ffffff 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  animation: "gold-shimmer 5s linear infinite",
                }}
              />
            </h1>

            <p
              className="mt-3 text-white/60 max-w-2xl mx-auto"
              style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}
            >
              {text(homeCms?.heroMainSubtitle, "مجموعة القاضي الذهبية للسفريات والسياحة — تجارب سفر استثنائية بأعلى معايير الفخامة والاحترافية.")}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <MagneticButton>
              <a href={text(homeCms?.heroPrimaryCtaHref, "#booking")} className="btn-gold pointer-events-auto inline-flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span>{text(homeCms?.heroPrimaryCtaLabel, "احجز رحلتك الآن")}</span>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href={text(homeCms?.heroSecondaryCtaHref, "#services")} className="btn-ghost-gold pointer-events-auto inline-flex items-center gap-2">
                <span>{text(homeCms?.heroSecondaryCtaLabel, "استكشف خدماتنا")}</span>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pointer-events-auto"
          >
            {stats.map((item, i) => {
              const icons = [Plane, ShieldCheck, Map, Clock];
              const Icon = icons[i % icons.length];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.07 }}
                className="flex items-center gap-3 rounded-2xl p-3"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(201,162,39,0.18)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <div
                  className="rounded-xl p-2 text-gold-400 shrink-0"
                  style={{ background: "rgba(201,162,39,0.12)" }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{item.label || ""}</p>
                  <p className="text-[10px] text-white/40">{item.sub || ""}</p>
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
