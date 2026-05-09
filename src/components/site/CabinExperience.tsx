"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─────────────────────────────────────────────
   Section definitions — each maps to a seat zone
   inside the Airbus A320 cabin model
───────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "tourism",
    eyebrow: "TRAVEL & TOURISM",
    title: "السياحة والسفريات",
    subtitle: "رفاهية في كل مسار",
    description:
      "نصمم لك رحلات بإيقاع هادئ وفخامة خالصة: حجوزات دقيقة، مرافقات احترافية، وتجارب وجهات تُروى كقصص ذهبية.",
    icon: "✈",
    badge: "Business Class · Rows 1–6",
    position: { x: 50, y: 22 },
    color: "#e8c547",
    shadowColor: "rgba(232,197,71,0.35)",
    features: [
      "تنسيق برامج سياحية مخصصة",
      "حجوزات طيران وفنادق بمعايير امتياز",
      "مرافقون سياحيون محترفون",
      "وجهات عالمية بأسلوب فاخر",
    ],
  },
  {
    id: "manpower",
    eyebrow: "MANPOWER SERVICES",
    title: "خدمة الأيادي العاملة",
    subtitle: "شبكة ثقة وكفاءة",
    description:
      "نربط المؤسسات بالمواهب عبر مسارات واضحة، عقود شفافة، ومتابعة إنسانية تعكس قيم مجموعة القاضي الذهبية.",
    icon: "◈",
    badge: "Economy Plus · Rows 7–15",
    position: { x: 75, y: 37 },
    color: "#7db8e8",
    shadowColor: "rgba(125,184,232,0.35)",
    features: [
      "توفير كوادر مؤهلة وفق الطلب",
      "ضبط جودة التوظيف والامتثال",
      "مسار موثوق للباحثين عن فرصة",
      "عقود شفافة ودعم إرشادي متكامل",
    ],
  },
  {
    id: "about",
    eyebrow: "ABOUT THE GROUP",
    title: "عن المجموعة",
    subtitle: "إرث ذهبي وخدمة راقية",
    description:
      "نجمع خبرة السفر والسياحة مع إدارة الموارد البشرية تحت مظلة واحدة، لنمنح شركاءنا تجربة متكاملة تعكس الجودة والاحترام.",
    icon: "✦",
    badge: "Economy · Rows 16–30",
    position: { x: 80, y: 58 },
    color: "#a8d8a8",
    shadowColor: "rgba(168,216,168,0.35)",
    features: [
      "هوية بصرية مستوحاة من الامتياز",
      "حضور وخبرة على المستوى العالمي",
      "دقة في التفاصيل وجودة بلا حدود",
      "ثقة تُبنى خطوة خطوة",
    ],
  },
  {
    id: "contact",
    eyebrow: "GET IN TOUCH",
    title: "تواصل معنا",
    subtitle: "نحن في خدمتكم دائماً",
    description:
      "اترك لنا بياناتك أو تواصل مباشرةً — فريق القاضي الذهبي جاهز لخدمتكم بسرعة واحتراف.",
    icon: "⊕",
    badge: "Exit Row · Row 12",
    position: { x: 32, y: 42 },
    color: "#e89f7d",
    shadowColor: "rgba(232,159,125,0.35)",
    features: [
      "بريد إلكتروني: info@alqadigroup.com",
      "هاتف: +966 00 000 0000",
      "خدمة العملاء على مدار الساعة",
      "مقرنا: المملكة العربية السعودية",
    ],
    cta: {
      primary: { label: "مراسلتنا", href: "mailto:info@alqadigroup.com" },
      secondary: { label: "اتصال مباشر", href: "tel:+966000000000" },
    },
  },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];
type Section = (typeof SECTIONS)[number];

/* ─────────────────────────────────────────────
   Panel animation variants
───────────────────────────────────────────── */
const panelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function CabinExperience() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const activeSection = SECTIONS.find((s) => s.id === activeId) ?? null;

  const open = useCallback((id: SectionId) => setActiveId(id), []);
  const close = useCallback(() => setActiveId(null), []);
  const handleLoad = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* ── 3D Cabin iframe ─────────────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: activeSection ? 1.06 : 1,
          filter: activeSection ? "blur(6px) brightness(0.35)" : "blur(0px) brightness(1)",
        }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <iframe
          title="Airbus A320 Airplane Cabin"
          src="https://sketchfab.com/models/e1f1fea95f41427b9fef55d0d145490d/embed?autostart=1&ui_theme=dark&dnt=1&ui_infos=0&ui_watermark=0&annotations_visible=0&ui_annotations=0"
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleLoad}
        />
      </motion.div>

      {/* ── Camera lock — prevents model rotation so hotspots stay on seats ── */}
      <div className="absolute inset-0 z-[5]" style={{ pointerEvents: isLoaded ? "auto" : "none" }} />

      {/* ── Cinema gradients ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,3,3,0.72) 0%, transparent 28%, transparent 70%, rgba(3,3,3,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,3,3,0.5) 0%, transparent 35%, transparent 65%, rgba(3,3,3,0.5) 100%)",
        }}
      />

      {/* ── Loading screen ─────────────────── */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black"
          >
            {/* Outer ring */}
            <div className="relative flex items-center justify-center mb-8">
              <div
                className="absolute w-24 h-24 rounded-full border border-transparent animate-spin"
                style={{
                  borderTopColor: "#e8c547",
                  borderRightColor: "rgba(232,197,71,0.3)",
                  animationDuration: "1.2s",
                }}
              />
              <div
                className="absolute w-16 h-16 rounded-full border border-transparent animate-spin"
                style={{
                  borderBottomColor: "#e8c547",
                  borderLeftColor: "rgba(232,197,71,0.2)",
                  animationDuration: "0.8s",
                  animationDirection: "reverse",
                }}
              />
              {/* Plane icon */}
              <span className="text-3xl" style={{ color: "#e8c547" }}>✈</span>
            </div>

            <p
              className="text-xs font-semibold tracking-[0.4em] uppercase mb-2"
              style={{ color: "rgba(232,197,71,0.7)" }}
            >
              Golden Al&apos;Qadi Group
            </p>
            <p className="text-[11px] tracking-[0.2em] text-white/25 uppercase">
              جاري تحميل النموذج…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────── */}
      <AnimatePresence>
        {!activeSection && isLoaded && (
          <motion.header
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-8 pt-8 md:px-14 md:pt-10"
          >
            <div>
              <p
                className="text-[10px] md:text-xs font-semibold tracking-[0.35em] mb-2"
                style={{ color: "rgba(232,197,71,0.75)" }}
              >
                GOLDEN AL&apos;QADI GROUP
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                مرحباً بمجموعة القاضي الذهبية
              </h1>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 pt-1">
              <p className="text-[10px] tracking-[0.3em] text-white/35 uppercase">
                Interactive Experience
              </p>
              <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase">
                A320 Cabin Navigator
              </p>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Seat Hotspots ─────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
        <AnimatePresence>
          {!activeSection &&
            SECTIONS.map((section, i) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08 + 0.2,
                  ease: "backOut",
                }}
                onClick={() => open(section.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                style={{
                  left: `${section.position.x}%`,
                  top: `${section.position.y}%`,
                }}
                aria-label={section.title}
              >
                {/* Outer pulse ring 1 */}
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: section.color,
                    opacity: 0.2,
                    width: 48,
                    height: 48,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    animationDuration: "2s",
                  }}
                />
                {/* Outer pulse ring 2 */}
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: section.color,
                    opacity: 0.12,
                    width: 64,
                    height: 64,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    animationDuration: "2.5s",
                    animationDelay: "0.4s",
                  }}
                />
                {/* Core button */}
                <span
                  className="relative flex items-center justify-center w-10 h-10 rounded-full text-base font-bold transition-all duration-250 group-hover:scale-125 group-active:scale-95"
                  style={{
                    backgroundColor: section.color + "22",
                    border: `1.5px solid ${section.color}99`,
                    color: section.color,
                    boxShadow: `0 0 16px ${section.shadowColor}, 0 0 32px ${section.shadowColor}`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {section.icon}
                </span>
                {/* Tooltip */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-12 whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: section.color + "18",
                    border: `1px solid ${section.color}44`,
                    color: section.color,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {section.title}
                </span>
              </motion.button>
            ))}
        </AnimatePresence>
      </div>

      {/* ── Section Panel ─────────────────────── */}
      <AnimatePresence>
        {activeSection && (
          <>
            {/* Dim overlay */}
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)" }}
              onClick={close}
            />

            {/* Content card */}
            <motion.div
              key={activeSection.id}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 z-50 flex items-center justify-center px-5"
            >
              <div
                className="relative w-full max-w-xl rounded-3xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(8,8,12,0.97) 0%, rgba(3,3,5,0.99) 100%)",
                  border: `1px solid ${activeSection.color}33`,
                  boxShadow: `0 0 80px ${activeSection.shadowColor}, 0 30px 60px rgba(0,0,0,0.7)`,
                }}
              >
                {/* Top glow bar */}
                <div
                  className="h-[2px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${activeSection.color} 50%, transparent 100%)`,
                  }}
                />

                <div className="p-8 md:p-10">
                  {/* Eyebrow + row badge */}
                  <div className="flex items-center justify-between mb-6">
                    <p
                      className="text-[10px] font-bold tracking-[0.35em] uppercase"
                      style={{ color: activeSection.color + "BB" }}
                    >
                      {activeSection.eyebrow}
                    </p>
                    <span
                      className="text-[10px] font-medium px-3 py-1 rounded-full tracking-wide"
                      style={{
                        background: activeSection.color + "15",
                        border: `1px solid ${activeSection.color}33`,
                        color: activeSection.color + "99",
                      }}
                    >
                      {activeSection.badge}
                    </span>
                  </div>

                  {/* Icon + title */}
                  <div className="flex items-start gap-5 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: activeSection.color + "15",
                        border: `1px solid ${activeSection.color}33`,
                        color: activeSection.color,
                        boxShadow: `0 0 24px ${activeSection.shadowColor}`,
                      }}
                    >
                      {activeSection.icon}
                    </div>
                    <div dir="rtl">
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {activeSection.title}
                      </h2>
                      <p
                        className="text-sm mt-1"
                        style={{ color: activeSection.color + "99" }}
                      >
                        {activeSection.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    dir="rtl"
                    className="text-sm leading-8 mb-7"
                    style={{ color: "rgba(248,242,228,0.6)" }}
                  >
                    {activeSection.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2.5 mb-8">
                    {activeSection.features.map((f, i) => (
                      <div
                        key={i}
                        dir="rtl"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs"
                        style={{
                          background: activeSection.color + "0C",
                          border: `1px solid ${activeSection.color}1F`,
                          color: "rgba(248,242,228,0.75)",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: activeSection.color }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {"cta" in activeSection && activeSection.cta ? (
                      <>
                        <a
                          href={activeSection.cta.primary.href}
                          className="flex-1 py-3 rounded-2xl text-sm font-bold text-center transition-all duration-200 hover:brightness-110 active:scale-95"
                          style={{
                            background: activeSection.color,
                            color: "#050505",
                          }}
                        >
                          {activeSection.cta.primary.label}
                        </a>
                        <a
                          href={activeSection.cta.secondary.href}
                          className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:border-opacity-60 active:scale-95"
                          style={{
                            border: `1px solid ${activeSection.color}44`,
                            color: activeSection.color + "CC",
                          }}
                        >
                          {activeSection.cta.secondary.label}
                        </a>
                      </>
                    ) : (
                      <button suppressHydrationWarning
                        className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-95"
                        style={{
                          background: activeSection.color,
                          color: "#050505",
                        }}
                      >
                        اكتشف أكثر
                      </button>
                    )}

                    <button suppressHydrationWarning
                      onClick={close}
                      className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95"
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.45)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      ← العودة
                    </button>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${activeSection.color}22 50%, transparent 100%)`,
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Section nav dots (right side) ─────── */}
      <AnimatePresence>
        {!activeSection && isLoaded && (
          <motion.nav
            key="nav-dots"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="absolute right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-none"
          >
            {SECTIONS.map((s) => (
              <button suppressHydrationWarning
                key={s.id}
                onClick={() => open(s.id)}
                className="w-1.5 h-8 rounded-full transition-all duration-300 pointer-events-auto hover:h-12"
                style={{
                  backgroundColor: s.color,
                  opacity: 0.35,
                  boxShadow: `0 0 8px ${s.shadowColor}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.85")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "0.35")
                }
                aria-label={s.title}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Bottom status bar ─────────────────── */}
      <AnimatePresence>
        {!activeSection && isLoaded && (
          <motion.div
            key="bottom-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#e8c547" }}
            />
            <span className="text-[11px] tracking-[0.25em] text-white/35 uppercase">
              انقر على أحد المقاعد للاستكشاف
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#e8c547", animationDelay: "0.5s" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Copyright watermark ───────────────── */}
      <div className="absolute bottom-7 right-8 z-30 pointer-events-none">
        <p className="text-[10px] tracking-widest text-white/15 uppercase">
          © {new Date().getFullYear()} Golden Al&apos;Qadi Group
        </p>
      </div>
    </div>
  );
}
