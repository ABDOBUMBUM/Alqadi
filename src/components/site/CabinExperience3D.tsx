"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Html,
  useProgress,
  ContactShadows,
} from "@react-three/drei";
import { AirlineOfficeScene } from "@/components/site/AirlineOfficeScene";
import { AnimatePresence, motion } from "framer-motion";
/* ─────────────────────────────────────────────
   Section Definitions & Data
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
    badge: "مكتب الحجوزات · نافذة المسارات",
    position: [-1.0, 1.35, 0.75] as const,
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
    badge: "ملفات الكوادر · التوظيف",
    position: [2.5, 1.45, -0.6] as const,
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
    badge: "لوحة الشبكة · عن المجموعة",
    position: [-2.2, 2.0, -4.0] as const,
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
    badge: "استقبال · خط مباشر",
    position: [1.2, 1.05, 0.9] as const,
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

/* ─────────────────────────────────────────────
   Animation Variants
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
   3D Components
───────────────────────────────────────────── */

// Loading Manager Overlay
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 100]}>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        className="flex flex-col items-center justify-center bg-black w-screen h-screen"
      >
        <div className="relative flex items-center justify-center mb-8">
          <div
            className="absolute w-24 h-24 rounded-full border border-transparent animate-spin"
            style={{ borderTopColor: "#e8c547", borderRightColor: "rgba(232,197,71,0.3)", animationDuration: "1.2s" }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border border-transparent animate-spin"
            style={{ borderBottomColor: "#e8c547", borderLeftColor: "rgba(232,197,71,0.2)", animationDuration: "0.8s", animationDirection: "reverse" }}
          />
          <span className="text-3xl" style={{ color: "#e8c547" }}>✈</span>
        </div>
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(232,197,71,0.7)" }}>
          Golden Al&apos;Qadi Group
        </p>
        <p className="text-[11px] tracking-[0.2em] text-white/25 uppercase">
          {progress < 100 ? `جاري التهيئة ${Math.round(progress)}%...` : "جاهز للانطلاق"}
        </p>
      </motion.div>
    </Html>
  );
}

// Interactive Hotspots placed natively in 3D Space
function Hotspots({ activeId, setActiveId }: { activeId: SectionId | null; setActiveId: (id: SectionId) => void }) {
  if (activeId) return null; // Hide hotspots if a panel is open

  return (
    <>
      {SECTIONS.map((section, i) => (
        <Html
          key={section.id}
          position={section.position}
          center
          zIndexRange={[50, 0]} // Ensures they layer correctly
          distanceFactor={10} // Scales beautifully with camera distance
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: "backOut" }}
            onClick={() => setActiveId(section.id)}
            className="relative group cursor-pointer"
            aria-label={section.title}
          >
            {/* Outer rings */}
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: section.color, opacity: 0.2, width: 48, height: 48, top: "50%", left: "50%", transform: "translate(-50%, -50%)", animationDuration: "2s" }} />
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: section.color, opacity: 0.12, width: 64, height: 64, top: "50%", left: "50%", transform: "translate(-50%, -50%)", animationDuration: "2.5s", animationDelay: "0.4s" }} />
            
            {/* Core */}
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full text-base font-bold transition-all duration-250 group-hover:scale-125 group-active:scale-95" style={{ backgroundColor: section.color + "22", border: `1.5px solid ${section.color}99`, color: section.color, boxShadow: `0 0 16px ${section.shadowColor}`, backdropFilter: "blur(6px)" }}>
              {section.icon}
            </span>

            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-12 whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ background: section.color + "18", border: `1px solid ${section.color}44`, color: section.color, backdropFilter: "blur(10px)" }}>
              {section.title}
            </span>
          </motion.button>
        </Html>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function CabinExperience3D() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const activeSection = SECTIONS.find((s) => s.id === activeId) ?? null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      
      {/* ── 3D Canvas Native Rendering  ─────────────────── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ filter: activeSection ? "blur(6px) brightness(0.35)" : "blur(0px) brightness(1)", scale: activeSection ? 1.05 : 1 }}
        transition={{ duration: 0.55 }}
      >
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1.45, 6.2]} fov={48} />
          
          <Suspense fallback={<Loader />}>
            <Environment preset="city" />
            <AirlineOfficeScene />
            <ContactShadows
              position={[0, 0.02, 1]}
              opacity={0.42}
              scale={14}
              blur={2.2}
              far={12}
            />
            
            {/* HTML overlays securely bound to 3D world coords */}
            <Hotspots activeId={activeId} setActiveId={setActiveId} />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            makeDefault
            minDistance={3.2}
            maxDistance={11}
            target={[0, 0.95, 0]}
            maxPolarAngle={Math.PI / 2 - 0.08}
            enabled={!activeSection}
          />
        </Canvas>
      </motion.div>

      {/* ── Cinema Overlay Gradients ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(180deg, rgba(3,3,3,0.72) 0%, transparent 28%, transparent 70%, rgba(3,3,3,0.85) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, rgba(3,3,3,0.5) 0%, transparent 35%, transparent 65%, rgba(3,3,3,0.5) 100%)" }} />

      {/* ── Header ───────────────────────────── */}
      <AnimatePresence>
        {!activeSection && (
          <motion.header
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-8 pt-8 md:px-14 md:pt-10 pointer-events-none"
          >
            <div>
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.35em] mb-2" style={{ color: "rgba(232,197,71,0.75)" }}>
                GOLDEN AL&apos;QADI GROUP
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                مرحباً بمجموعة القاضي الذهبية
              </h1>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 pt-1 text-end">
              <p className="text-[10px] tracking-[0.2em] text-white/40">
                مكتب حجوزات فاخر
              </p>
              <p className="text-[10px] tracking-[0.15em] text-gold-500/75">
                تجربة ثلاثية الأبعاد — تدوير بالفأرة
              </p>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Section Panel UI ─────────────────────── */}
      <AnimatePresence>
        {activeSection && (
          <>
            <motion.div key="overlay" variants={overlayVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setActiveId(null)} />

            <motion.div key={activeSection.id} variants={panelVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 z-50 flex items-center justify-center px-5 pointer-events-none">
              <div
                className="relative w-full max-w-xl rounded-3xl overflow-hidden pointer-events-auto"
                style={{ background: "linear-gradient(160deg, rgba(8,8,12,0.97) 0%, rgba(3,3,5,0.99) 100%)", border: `1px solid ${activeSection.color}33`, boxShadow: `0 0 80px ${activeSection.shadowColor}, 0 30px 60px rgba(0,0,0,0.7)` }}
              >
                <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent 0%, ${activeSection.color} 50%, transparent 100%)` }} />

                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-bold tracking-[0.35em] uppercase" style={{ color: activeSection.color + "BB" }}>{activeSection.eyebrow}</p>
                    <span className="text-[10px] font-medium px-3 py-1 rounded-full tracking-wide" style={{ background: activeSection.color + "15", border: `1px solid ${activeSection.color}33`, color: activeSection.color + "99" }}>{activeSection.badge}</span>
                  </div>

                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: activeSection.color + "15", border: `1px solid ${activeSection.color}33`, color: activeSection.color, boxShadow: `0 0 24px ${activeSection.shadowColor}` }}>
                      {activeSection.icon}
                    </div>
                    <div dir="rtl">
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{activeSection.title}</h2>
                      <p className="text-sm mt-1" style={{ color: activeSection.color + "99" }}>{activeSection.subtitle}</p>
                    </div>
                  </div>

                  <p dir="rtl" className="text-sm leading-8 mb-7" style={{ color: "rgba(248,242,228,0.6)" }}>{activeSection.description}</p>

                  <div className="grid grid-cols-2 gap-2.5 mb-8">
                    {activeSection.features.map((f, i) => (
                      <div key={i} dir="rtl" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs" style={{ background: activeSection.color + "0C", border: `1px solid ${activeSection.color}1F`, color: "rgba(248,242,228,0.75)" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: activeSection.color }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {"cta" in activeSection && activeSection.cta ? (
                      <>
                        <a href={activeSection.cta.primary.href} className="flex-1 py-3 rounded-2xl text-sm font-bold text-center transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: activeSection.color, color: "#050505" }}>{activeSection.cta.primary.label}</a>
                        <a href={activeSection.cta.secondary.href} className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:border-opacity-60 active:scale-95" style={{ border: `1px solid ${activeSection.color}44`, color: activeSection.color + "CC" }}>{activeSection.cta.secondary.label}</a>
                      </>
                    ) : (
                      <button suppressHydrationWarning className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-95" style={{ background: activeSection.color, color: "#050505" }}>اكتشف أكثر</button>
                    )}
                    <button suppressHydrationWarning onClick={() => setActiveId(null)} className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>← العودة</button>
                  </div>
                </div>
                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 0%, ${activeSection.color}22 50%, transparent 100%)` }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Status Nav Dots ─────────────────── */}
      <AnimatePresence>
        {!activeSection && (
          <motion.nav key="nav-dots" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4, delay: 0.3 }} className="absolute right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-none">
            {SECTIONS.map((s) => (
              <button suppressHydrationWarning key={s.id} onClick={() => setActiveId(s.id)} className="w-1.5 h-8 rounded-full transition-all duration-300 pointer-events-auto hover:h-12" style={{ backgroundColor: s.color, opacity: 0.35, boxShadow: `0 0 8px ${s.shadowColor}` }} />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="absolute bottom-7 right-8 z-30 pointer-events-none">
        <p className="text-[10px] tracking-widest text-white/15 uppercase">© {new Date().getFullYear()} Golden Al&apos;Qadi Group</p>
      </div>
    </div>
  );
}
