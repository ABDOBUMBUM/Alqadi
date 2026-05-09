"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";

const LOCATIONS = [
  {
    id: "london", name: "لندن", country: "المملكة المتحدة",
    emoji: "🇬🇧", flag: "GB",
    cx: 46.5, cy: 30.0,
    priceKWD: 210,
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "paris", name: "باريس", country: "فرنسا",
    emoji: "🇫🇷", flag: "FR",
    cx: 47.8, cy: 33.0,
    priceKWD: 175,
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "istanbul", name: "إسطنبول", country: "تركيا",
    emoji: "🇹🇷", flag: "TR",
    cx: 55.5, cy: 36.0,
    priceKWD: 145,
    img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "cairo", name: "القاهرة", country: "مصر",
    emoji: "🇪🇬", flag: "EG",
    cx: 54.0, cy: 44.5,
    priceKWD: 90,
    img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "dubai", name: "دبي", country: "الإمارات",
    emoji: "🇦🇪", flag: "AE",
    cx: 63.0, cy: 48.0,
    priceKWD: 190,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "kuala", name: "كوالالمبور", country: "ماليزيا",
    emoji: "🇲🇾", flag: "MY",
    cx: 77.5, cy: 60.0,
    priceKWD: 130,
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "maldives", name: "المالديف", country: "جزر المالديف",
    emoji: "🇲🇻", flag: "MV",
    cx: 70.0, cy: 62.0,
    priceKWD: 350,
    img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "bangkok", name: "بانكوك", country: "تايلاند",
    emoji: "🇹🇭", flag: "TH",
    cx: 78.0, cy: 54.5,
    priceKWD: 155,
    img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=120&q=80",
  },
];

/* Simple but accurate world map SVG path (Natural Earth simplified) */
const WORLD_PATH = `
M 150,82 L 155,78 L 165,76 L 178,78 L 190,74 L 200,72 L 215,68 L 225,64 L 238,60
L 255,58 L 268,56 L 278,54 L 290,52 L 302,50 L 315,50 L 328,52 L 338,54 L 350,52
L 362,50 L 375,48 L 388,46 L 400,44 L 412,44 L 420,46 L 430,48 L 440,52 L 448,56
L 455,62 L 460,68 L 462,76 L 460,84 L 455,90 L 448,96 L 440,100 L 430,104 L 420,108
L 410,110 L 400,112 L 390,112 L 380,110 L 370,108 L 360,106 L 350,104 L 340,102
L 330,100 L 320,100 L 310,102 L 302,104 L 295,108 L 290,114 L 288,122 L 290,130
L 295,138 L 302,144 L 310,148 L 320,150 L 330,150 L 340,148 L 348,144 L 354,140
L 358,134 L 360,128 L 362,122 L 366,118 L 372,114 L 380,112 L 390,112 L 400,114
L 408,118 L 414,124 L 418,130 L 420,138 L 420,146 L 418,154 L 414,162 L 408,168
L 400,172 L 390,174 L 380,174 L 370,172 L 362,168 L 356,162 L 352,156 L 350,150
L 348,156 L 344,162 L 338,168 L 330,172 L 320,174 L 310,174 L 300,172 L 292,168
L 286,162 L 282,156 L 280,150 L 278,144 L 274,138 L 268,132 L 260,128 L 250,126
L 240,126 L 230,128 L 222,132 L 216,138 L 212,146 L 210,154 L 210,162 L 212,170
L 216,178 L 220,184 L 224,190 L 226,196 L 226,202 L 224,208 L 220,212 L 214,214
L 208,212 L 202,208 L 198,202 L 196,196 L 196,190 L 198,184 L 200,178 L 200,172
L 198,166 L 194,162 L 188,158 L 180,156 L 172,156 L 164,158 L 158,162 L 154,168
L 152,174 L 152,180 L 154,186 L 158,192 L 162,196 L 166,200 L 168,206 L 168,212
L 166,218 L 162,222 L 156,224 L 150,224 L 144,222 L 138,218 L 134,212 L 132,206
L 132,200 L 134,194 L 138,188 L 140,182 L 140,176 L 138,170 L 134,164 L 128,160
L 122,158 L 116,158 L 110,160 L 106,164 L 104,170 L 104,176 L 106,182 L 108,188
L 108,194 L 106,200 L 102,204 L 96,206 L 90,204 L 84,200 L 80,194 L 78,188
L 78,182 L 80,176 L 84,170 L 86,164 L 86,158 L 84,152 L 80,146 L 74,142 L 68,140
L 62,140 L 56,142 L 52,146 L 50,152 L 50,158 L 52,164 L 56,168 L 60,170 L 64,170
L 68,168 L 70,164 L 70,158 L 68,154 L 64,150 L 60,148 L 56,148 L 52,150 L 50,154
`;

export function InteractiveWorldMap() {
  const [active, setActive] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  const activeLocation = LOCATIONS.find(l => l.id === active);

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ background: "var(--section-alt-bg)", color: "var(--page-text)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 text-center"
        >
          <p className="text-xs tracking-[0.4em] text-gold-400">GLOBAL NETWORK</p>
          <h2 className="mt-4 text-3xl font-black md:text-5xl" style={{ color: "var(--page-text)" }}>
            شبكة وجهاتنا <span className="text-gold-gradient">العالمية</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl" style={{ color: "var(--page-text-muted)" }}>
            نغطي أبرز الوجهات السياحية والتجارية حول العالم — اضغط على أي دبوس لعرض التفاصيل.
          </p>
        </motion.div>

        {/* Map Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* SVG Map */}
          <div
            className="relative w-full overflow-hidden rounded-3xl border border-gold-500/15"
            style={{ background: "var(--page-surface)", paddingBottom: "50%" }}
          >
            <svg
              viewBox="0 0 500 250"
              className="absolute inset-0 h-full w-full"
              style={{ filter: "drop-shadow(0 0 30px rgba(201,168,76,0.08))" }}
            >
              {/* Grid */}
              <defs>
                <pattern id="mapgrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="var(--map-grid-stroke)" strokeWidth="0.5" />
                </pattern>
                {/* Gradient for map body */}
                <radialGradient id="mapglow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(201,168,76,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <rect width="500" height="250" fill="url(#mapgrid)" />
              <ellipse cx="250" cy="125" rx="200" ry="100" fill="url(#mapglow)" />

              {/* Simplified continent shapes */}
              {/* Europe */}
              <path d="M 228 52 L 240 48 L 255 50 L 262 58 L 258 68 L 248 72 L 238 70 L 228 62 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />
              {/* Africa */}
              <path d="M 235 85 L 252 80 L 265 88 L 270 105 L 265 125 L 252 135 L 238 128 L 230 110 L 232 95 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />
              {/* Asia */}
              <path d="M 265 55 L 310 45 L 360 50 L 390 62 L 395 80 L 380 95 L 350 100 L 310 98 L 278 90 L 265 75 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />
              {/* Americas */}
              <path d="M 80 55 L 100 50 L 120 55 L 128 70 L 122 88 L 108 95 L 90 90 L 80 75 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />
              <path d="M 95 100 L 112 95 L 122 108 L 118 128 L 108 140 L 92 138 L 82 122 L 84 108 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />
              {/* Australia */}
              <path d="M 370 130 L 395 125 L 408 138 L 402 155 L 385 160 L 370 152 L 365 138 Z"
                fill="var(--map-land-fill)" stroke="var(--map-land-stroke)" strokeWidth="0.5" />

              {/* Location pins */}
              {LOCATIONS.map((loc, i) => {
                const x = (loc.cx / 100) * 500;
                const y = (loc.cy / 100) * 250;
                const isActive = active === loc.id;

                return (
                  <g key={loc.id} className="cursor-pointer"
                    onClick={() => setActive(isActive ? null : loc.id)}
                    onMouseEnter={() => setActive(loc.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {/* Pulse ring */}
                    <motion.circle cx={x} cy={y} r="10" fill="none"
                      stroke="#C9A84C" strokeWidth="1"
                      initial={{ scale: 0.5, opacity: 0.6 }}
                      animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                    />
                    {/* Hit area */}
                    <circle cx={x} cy={y} r="12" fill="transparent" />
                    {/* Pin dot */}
                    <motion.circle cx={x} cy={y} r={isActive ? 6 : 4}
                      fill={isActive ? "#F5D278" : "#C9A84C"}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                    {/* Country emoji label */}
                    <text x={x} y={y - 14} textAnchor="middle" fontSize="8"
                      fill="var(--page-text-muted)" className="pointer-events-none select-none">
                      {loc.emoji}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip with circular image */}
            <AnimatePresence>
              {activeLocation && (
                <motion.div
                  key={activeLocation.id}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="pointer-events-none absolute z-20"
                  style={{
                    left: `${activeLocation.cx}%`,
                    top: `${activeLocation.cy}%`,
                    transform: "translate(-50%, -155%)",
                  }}
                >
                  <div
                    className="relative flex min-w-[160px] flex-col items-center rounded-2xl border border-gold-500/40 p-3 shadow-[0_8px_30px_rgba(201,168,76,0.2)] backdrop-blur-xl"
                    style={{ background: "var(--map-tooltip-bg)", color: "var(--map-tooltip-text)" }}
                  >
                    {/* Circular destination image */}
                    <div className="mb-2 h-14 w-14 overflow-hidden rounded-full border-2 border-gold-500/60 shadow-lg shadow-gold-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeLocation.img}
                        alt={activeLocation.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold" style={{ color: "var(--map-tooltip-text)" }}>
                      {activeLocation.name}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--map-tooltip-subtext)" }}>
                      {activeLocation.country}
                    </p>
                    <div className="mt-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1">
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600" dir="ltr">
                          {formatPrice(activeLocation.priceKWD)}
                        </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-gold-500/40"
                      style={{ background: "var(--map-tooltip-bg)" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Destinations grid below map */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {LOCATIONS.map(loc => (
              <motion.button
                key={loc.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActive(active === loc.id ? null : loc.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-right transition ${
                  active === loc.id
                    ? "border-gold-500/50 bg-gold-500/10"
                    : "hover:border-gold-500/20"
                }`}
                style={
                  active === loc.id
                    ? undefined
                    : { borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }
                }
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gold-500/30">
                  <Image src={loc.img} alt={loc.name} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: "var(--page-text)" }}>
                    {loc.name}
                  </p>
                  <p className="text-xs text-gold-400" dir="ltr">{formatPrice(loc.priceKWD)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
