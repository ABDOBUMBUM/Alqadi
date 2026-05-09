"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plane, ShieldCheck, Map, Clock } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   AURORA ORBS  — cinematic background light blobs
───────────────────────────────────────────────────────── */
function AuroraOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Top-right warm amber orb */}
      <div
        className="absolute -top-32 -right-32 h-[700px] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0.06) 40%, transparent 70%)",
          animation: "aurora 14s ease-in-out infinite",
        }}
      />
      {/* Bottom-left deep orb */}
      <div
        className="absolute -bottom-48 -left-24 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(201,162,39,0.1) 0%, rgba(232,197,71,0.04) 50%, transparent 70%)",
          animation: "aurora 18s ease-in-out infinite reverse",
        }}
      />
      {/* Centre top subtle */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(201,162,39,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED BADGE
───────────────────────────────────────────────────────── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8"
    >
      <div
        className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
        style={{
          background: "rgba(201,162,39,0.08)",
          border: "1px solid rgba(201,162,39,0.35)",
          backdropFilter: "blur(16px)",
        }}
      >
        <span
          className="h-2 w-2 rounded-full bg-gold-400"
          style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
        />
        <span
          className="text-xs font-bold tracking-[0.25em] uppercase"
          style={{ color: "var(--gold-300)" }}
        >
          PRIVATE AVIATION &amp; LUXURY TRAVEL
        </span>
        <span className="text-gold-700 text-xs">✦</span>
        <span
          className="text-xs font-bold tracking-[0.1em]"
          style={{ color: "var(--gold-400)" }}
        >
          الكويت
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED HEADLINE
───────────────────────────────────────────────────────── */
function HeroHeadline() {
  const lines = ["سافر بثقة", "نرتقي بتجربتك"];

  return (
    <div className="mb-6">
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="overflow-hidden">
          <motion.h1
            className="block font-black leading-[1.05] tracking-tighter"
            style={{
              fontFamily: "var(--font-cairo), sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              background:
                lineIdx === 0
                  ? "linear-gradient(120deg, #ffffff 0%, #fffbea 40%, var(--gold-300) 70%, #ffffff 100%)"
                  : "linear-gradient(120deg, var(--gold-300) 0%, var(--gold-400) 30%, var(--gold-200) 60%, var(--gold-500) 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "gold-shimmer 5s linear infinite",
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.35 + lineIdx * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.h1>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CINEMATIC WINDOW  — the centrepiece of the design
───────────────────────────────────────────────────────── */
function CinematicWindow() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9, rotateY: -8 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: "1200px" }}
    >
      {/* OUTER GLOW */}
      <div
        className="absolute -inset-4 rounded-[2.5rem]"
        style={{
          background: hovered
            ? "radial-gradient(ellipse, rgba(201,162,39,0.25) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(201,162,39,0.12) 0%, transparent 70%)",
          transition: "background 0.6s ease",
        }}
      />

      {/* MAIN WINDOW FRAME */}
      <div
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          border: "2px solid rgba(201,162,39,0.4)",
          boxShadow: `
            0 0 0 6px rgba(201,162,39,0.08),
            0 0 0 14px rgba(201,162,39,0.04),
            0 40px 120px rgba(0,0,0,0.8),
            inset 0 0 60px rgba(201,162,39,0.06)
          `,
          background: "rgba(5,4,4,0.95)",
        }}
      >
        {/* WINDOW IMAGE — private jet view */}
        <div className="relative h-[360px] w-full overflow-hidden">
          <Image
            src="/assets/hero_luxury_bg.png"
            alt="Private Jet Luxury Cabin Window - View of clouds at sunset"
            fill
            className="object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1.0)",
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              objectPosition: "center 30%",
            }}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Cinematic overlay inside window */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, transparent 30%, rgba(5,4,4,0.15) 60%, rgba(5,4,4,0.5) 100%)",
            }}
          />

          {/* Golden vignette effect */}
          <div
            className="absolute inset-0 rounded-[1.8rem]"
            style={{
              boxShadow: "inset 0 0 80px rgba(201,162,39,0.08)",
            }}
          />

          {/* STARS RATING — floating inside window */}
          <motion.div
            className="absolute top-5 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div
              className="flex items-center gap-1 rounded-full px-4 py-1.5"
              style={{
                background: "rgba(5,4,4,0.65)",
                border: "1px solid rgba(201,162,39,0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-3 h-3"
                  fill="var(--gold-400)"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-[10px] font-bold text-gold-400 mr-1">5.0</span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM INFO BAR inside window */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "linear-gradient(90deg, rgba(10,8,7,0.98) 0%, rgba(15,12,9,0.95) 100%)",
            borderTop: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gold-500 uppercase mb-0.5">
              GOLDEN AL&apos;QADI GROUP
            </p>
            <p className="text-xs text-white/50">15+ سنة خبرة · الكويت</p>
          </div>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)" }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" style={{ animation: "pulse-glow 2s infinite" }} />
            <span className="text-xs font-bold text-gold-400">متاح الآن</span>
          </div>
        </div>
      </div>

      {/* DECORATIVE CORNER MARKS */}
      {[
        { top: 0, left: 0, rotate: "0deg" },
        { top: 0, right: 0, rotate: "90deg" },
        { bottom: 0, right: 0, rotate: "180deg" },
        { bottom: 0, left: 0, rotate: "270deg" },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-6 h-6"
          style={{
            ...pos,
            transform: `rotate(${pos.rotate})`,
            opacity: 0.7,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M0 8 L0 0 L8 0" stroke="var(--gold-400)" strokeWidth="2" />
          </svg>
        </div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATS STRIP — horizontal floating cards
───────────────────────────────────────────────────────── */
function StatsStrip() {
  const items = [
    { icon: <Plane className="w-5 h-5" />, label: "حجوزات طيران", sub: "أفضل الأسعار" },
    { icon: <ShieldCheck className="w-5 h-5" />, label: "خدمات متكاملة", sub: "حلول سفر شاملة" },
    { icon: <Map className="w-5 h-5" />, label: "برامج سياحية", sub: "تجارب فريدة" },
    { icon: <Clock className="w-5 h-5" />, label: "دعم على مدار الساعة", sub: "خدمة عملاء 24/7" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex flex-col items-center text-center rounded-xl p-4 feature-card group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
          whileHover={{ y: -4 }}
        >
          <div
            className="mb-2.5 rounded-xl p-3 text-gold-400 group-hover:text-gold-300 transition-colors"
            style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
          >
            {item.icon}
          </div>
          <p className="text-sm font-bold text-white leading-tight mb-0.5">{item.label}</p>
          <p className="text-[11px] text-white/40">{item.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SCROLL INDICATOR
───────────────────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-white/25">SCROLL</span>
      <div
        className="w-5 h-9 rounded-full flex justify-center pt-2"
        style={{ border: "1px solid rgba(201,162,39,0.3)" }}
      >
        <motion.div
          className="w-1 h-1 rounded-full bg-gold-400"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const springScale = useSpring(bgScale, { stiffness: 80, damping: 30 });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-black noise-overlay"
      aria-label="قسم البطل"
    >
      {/* ── Parallax Background ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: springScale }}
      >
        <Image
          src="/assets/background.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
          priority
          sizes="100vw"
          aria-hidden
        />
        {/* Deep black overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(5,4,4,0.55) 0%, rgba(5,4,4,0.45) 40%, rgba(5,4,4,0.9) 85%, rgba(5,4,4,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(5,4,4,0.85) 0%, rgba(5,4,4,0.2) 60%, rgba(5,4,4,0.4) 100%)",
          }}
        />
      </motion.div>

      {/* ── Aurora Light Effects ── */}
      <div className="absolute inset-0 z-1">
        <AuroraOrbs />
      </div>

      {/* ── Gold top accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--gold-500) 25%, var(--gold-300) 50%, var(--gold-500) 75%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* ── Main Content ── */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 md:px-10"
        style={{ y: contentY }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen pt-32 pb-20">

          {/* LEFT — Text Content */}
          <div>
            <HeroBadge />
            <HeroHeadline />

            <motion.p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(245,241,232,0.65)", fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              مجموعة القاضي للسفريات والسياحة — نوفر لك تجارب سفر استثنائية بخدمات متكاملة
              ووجودٍ لا يُضاهى. اكتشف العالم بأعلى معايير الفخامة والاحترافية.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <motion.a
                href="#booking"
                className="btn-gold"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plane className="w-4 h-4" />
                <span>احجز رحلتك الآن</span>
              </motion.a>
              <motion.a
                href="#services"
                className="btn-ghost-gold"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>استكشف خدماتنا</span>
              </motion.a>
            </motion.div>

            {/* Stats Strip */}
            <StatsStrip />
          </div>

          {/* RIGHT — Cinematic Window */}
          <motion.div
            className="relative hidden lg:block"
            style={{ opacity: bgOpacity }}
          >
            <CinematicWindow />

            {/* Floating award badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 rounded-2xl p-5 z-20"
              style={{
                background: "linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)",
                boxShadow: "0 20px 60px rgba(201,162,39,0.4), 0 0 0 2px rgba(232,197,71,0.3)",
              }}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 1.0 }}
              whileHover={{ scale: 1.08, rotate: 5 }}
            >
              <p className="text-3xl font-black text-black leading-none">15+</p>
              <p className="text-xs font-bold text-black/70 uppercase tracking-widest mt-1">سنة خبرة</p>
            </motion.div>

            {/* Floating trust indicator */}
            <motion.div
              className="absolute -top-4 -left-4 rounded-xl px-4 py-3 z-20"
              style={{
                background: "rgba(10,8,7,0.92)",
                border: "1px solid rgba(201,162,39,0.3)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1 -space-x-reverse">
                  {["A", "B", "C"].map((l, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: `hsl(${40 + i * 15}, 80%, 50%)`,
                        border: "2px solid rgba(10,8,7,0.9)",
                        color: "#050404",
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gold-400">+50,000</p>
                  <p className="text-[9px] text-white/40">عميل سعيد</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <ScrollIndicator />
    </section>
  );
}
