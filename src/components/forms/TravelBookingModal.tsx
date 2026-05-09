"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plane, Hotel, Calendar, Users, ArrowLeft,
  ArrowRight, MessageCircle, Check, ChevronDown,
  MapPin, Sparkles,
} from "lucide-react";

/* ── types ─────────────────────────────────── */
type TripKind = "one-way" | "round" | "package";
type SeatClass = "economy" | "business" | "first";
type Step = 0 | 1 | 2 | 3;

const DESTINATIONS = [
  // Middle East & GCC
  { city: "الكويت", country: "الكويت", emoji: "🇰🇼" },
  { city: "الرياض", country: "السعودية", emoji: "🇸🇦" },
  { city: "جدة", country: "السعودية", emoji: "🇸🇦" },
  { city: "دبي", country: "الإمارات", emoji: "🇦🇪" },
  { city: "أبوظبي", country: "الإمارات", emoji: "🇦🇪" },
  { city: "الدوحة", country: "قطر", emoji: "🇶🇦" },
  { city: "المنامة", country: "البحرين", emoji: "🇧🇭" },
  { city: "مسقط", country: "عمان", emoji: "🇴🇲" },
  { city: "القاهرة", country: "مصر", emoji: "🇪🇬" },
  { city: "شرم الشيخ", country: "مصر", emoji: "🇪🇬" },
  { city: "عمان", country: "الأردن", emoji: "🇯🇴" },
  { city: "بيروت", country: "لبنان", emoji: "🇱🇧" },
  // Europe
  { city: "لندن", country: "المملكة المتحدة", emoji: "🇬🇧" },
  { city: "باريس", country: "فرنسا", emoji: "🇫🇷" },
  { city: "ميونخ", country: "ألمانيا", emoji: "🇩🇪" },
  { city: "برلين", country: "ألمانيا", emoji: "🇩🇪" },
  { city: "روما", country: "إيطاليا", emoji: "🇮🇹" },
  { city: "ميلان", country: "إيطاليا", emoji: "🇮🇹" },
  { city: "فينيسيا", country: "إيطاليا", emoji: "🇮🇹" },
  { city: "مدريد", country: "إسبانيا", emoji: "🇪🇸" },
  { city: "برشلونة", country: "إسبانيا", emoji: "🇪🇸" },
  { city: "أمستردام", country: "هولندا", emoji: "🇳🇱" },
  { city: "فيينا", country: "النمسا", emoji: "🇦🇹" },
  { city: "زيورخ", country: "سويسرا", emoji: "🇨🇭" },
  { city: "جنيف", country: "سويسرا", emoji: "🇨🇭" },
  { city: "براغ", country: "التشيك", emoji: "🇨🇿" },
  { city: "أثينا", country: "اليونان", emoji: "🇬🇷" },
  { city: "ستوكهولم", country: "السويد", emoji: "🇸🇪" },
  { city: "أوسلو", country: "النرويج", emoji: "🇳🇴" },
  { city: "كوبنهاغن", country: "الدنمارك", emoji: "🇩🇰" },
  // Asia
  { city: "إسطنبول", country: "تركيا", emoji: "🇹🇷" },
  { city: "أنطاليا", country: "تركيا", emoji: "🇹🇷" },
  { city: "طرابزون", country: "تركيا", emoji: "🇹🇷" },
  { city: "المالديف", country: "جزر المالديف", emoji: "🇲🇻" },
  { city: "كوالالمبور", country: "ماليزيا", emoji: "🇲🇾" },
  { city: "لنكاوي", country: "ماليزيا", emoji: "🇲🇾" },
  { city: "بانكوك", country: "تايلاند", emoji: "🇹🇭" },
  { city: "بوكيت", country: "تايلاند", emoji: "🇹🇭" },
  { city: "سنغافورة", country: "سنغافورة", emoji: "🇸🇬" },
  { city: "بالي", country: "إندونيسيا", emoji: "🇮🇩" },
  { city: "طوكيو", country: "اليابان", emoji: "🇯🇵" },
  { city: "أوساكا", country: "اليابان", emoji: "🇯🇵" },
  { city: "سيول", country: "كوريا الجنوبية", emoji: "🇰🇷" },
  { city: "بكين", country: "الصين", emoji: "🇨🇳" },
  { city: "مومباي", country: "الهند", emoji: "🇮🇳" },
  { city: "كولومبو", country: "سريلانكا", emoji: "🇱🇰" },
  { city: "باكو", country: "أذربيجان", emoji: "🇦🇿" },
  { city: "تبليسي", country: "جورجيا", emoji: "🇬🇪" },
  { city: "سراييفو", country: "البوسنة", emoji: "🇧🇦" },
  // Americas
  { city: "نيويورك", country: "أمريكا", emoji: "🇺🇸" },
  { city: "لوس أنجلوس", country: "أمريكا", emoji: "🇺🇸" },
  { city: "ميامي", country: "أمريكا", emoji: "🇺🇸" },
  { city: "تورونتو", country: "كندا", emoji: "🇨🇦" },
  { city: "فانكوفر", country: "كندا", emoji: "🇨🇦" },
  { city: "ريو دي جانيرو", country: "البرازيل", emoji: "🇧🇷" },
  { city: "بوينس آيرس", country: "الأرجنتين", emoji: "🇦🇷" },
  // Africa
  { city: "الدار البيضاء", country: "المغرب", emoji: "🇲🇦" },
  { city: "مراكش", country: "المغرب", emoji: "🇲🇦" },
  { city: "كيب تاون", country: "جنوب أفريقيا", emoji: "🇿🇦" },
  { city: "نيروبي", country: "كينيا", emoji: "🇰🇪" },
  { city: "بورت لويس", country: "موريشيوس", emoji: "🇲🇺" },
  { city: "ماهي", country: "سيشيل", emoji: "🇸🇨" },
  // Oceania
  { city: "سيدني", country: "أستراليا", emoji: "🇦🇺" },
  { city: "ملبورن", country: "أستراليا", emoji: "🇦🇺" },
  { city: "أوكلاند", country: "نيوزيلندا", emoji: "🇳🇿" },
];

const SEAT_CLASSES: { value: SeatClass; label: string; sub: string; icon: string }[] = [
  { value: "economy", label: "اقتصادي", sub: "Economy Class", icon: "💺" },
  { value: "business", label: "رجال أعمال", sub: "Business Class", icon: "🛋️" },
  { value: "first", label: "درجة أولى", sub: "First Class", icon: "👑" },
];

const TRIP_KINDS: { value: TripKind; label: string; icon: string }[] = [
  { value: "one-way", label: "ذهاب فقط", icon: "→" },
  { value: "round", label: "ذهاب وعودة", icon: "⇄" },
  { value: "package", label: "باقة شاملة", icon: "🎁" },
];

const STEPS = ["نوع الرحلة", "المسار", "المسافرون", "التأكيد"];

/* ── helpers ─────────────────────────────── */
function buildWA(data: {
  kind: TripKind; from: string; to: string;
  depart: string; ret: string;
  adults: number; children: number; infants: number;
  seat: SeatClass; notes: string;
}) {
  const kindLabel = TRIP_KINDS.find(k => k.value === data.kind)?.label ?? data.kind;
  const seatLabel = SEAT_CLASSES.find(s => s.value === data.seat)?.label ?? data.seat;
  let msg = `✈️ *طلب حجز رحلة — مجموعة القاضي الذهبية*\n\n`;
  msg += `📋 نوع الرحلة: ${kindLabel}\n`;
  msg += `🛫 من: ${data.from}\n`;
  msg += `🛬 إلى: ${data.to}\n`;
  msg += `📅 تاريخ الذهاب: ${data.depart || "لم يُحدد"}\n`;
  if (data.kind === "round") msg += `📅 تاريخ العودة: ${data.ret || "لم يُحدد"}\n`;
  msg += `\n👥 المسافرون:\n`;
  msg += `   • بالغون: ${data.adults}\n`;
  if (data.children > 0) msg += `   • أطفال (2-11): ${data.children}\n`;
  if (data.infants > 0) msg += `   • رضّع (أقل من 2): ${data.infants}\n`;
  msg += `\n💺 درجة المقعد: ${seatLabel}\n`;
  if (data.notes) msg += `\n📝 ملاحظات: ${data.notes}\n`;
  msg += `\nأرجو التواصل لتأكيد الحجز وتفاصيل الأسعار.`;
  return `https://api.whatsapp.com/send?phone=96598765432&text=${encodeURIComponent(msg)}`;
}

/* ── sub-components ─────────────────────── */
function Counter({ label, sub, value, onChange, min = 0 }: {
  label: string; sub: string; value: number; onChange: (v: number) => void; min?: number;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border px-4 py-3"
      style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--page-text)" }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: "var(--page-text-dim)" }}>
          {sub}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15 transition text-lg">−</button>
        <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--page-text)" }}>
          {value}
        </span>
        <button onClick={() => onChange(Math.min(9, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15 transition text-lg">+</button>
      </div>
    </div>
  );
}

function DestSelect({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const found = DESTINATIONS.find(d => d.city === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
        {label}
      </label>
      <button onClick={() => setOpen(o => !o)} type="button"
        className="flex w-full items-center justify-between rounded-xl border border-gold-500/25 px-4 py-3 text-sm transition hover:border-gold-400"
        style={{ background: "var(--input-bg)", color: "var(--page-text)" }}
      >
        <span className="flex items-center gap-2">
          {found ? (<><span>{found.emoji}</span><span>{found.city} — {found.country}</span></>) : (
            <span style={{ color: "var(--page-text-dim)" }}>اختر المدينة…</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gold-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-xl border shadow-2xl"
            style={{
              borderColor: "rgba(201,162,39,0.22)",
              background: "color-mix(in oklab, var(--page-bg) 88%, black 12%)",
            }}
          >
            {DESTINATIONS.map(d => (
              <li key={d.city}>
                <button type="button" onClick={() => { onChange(d.city); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-gold-500/10 ${value === d.city ? "text-gold-300 bg-gold-500/10" : ""}`}
                  style={value === d.city ? undefined : { color: "var(--page-text)" }}
                >
                  <span>{d.emoji}</span>
                  <span>{d.city}</span>
                  <span className="text-xs" style={{ color: "var(--page-text-dim)" }}>
                    — {d.country}
                  </span>
                  {value === d.city && <Check className="mr-auto h-3.5 w-3.5 text-gold-400" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomDatePicker({ label, value, onChange, minDate }: { label: string; value: string; onChange: (v: string) => void; minDate?: string }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay(); // 0 is Sunday
  const monthName = viewDate.toLocaleString("ar", { month: "long" });
  const year = viewDate.getFullYear();

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));
    const str = localDate.toISOString().split("T")[0];
    
    if (minDate && str < minDate) return;
    
    onChange(str);
    setOpen(false);
  };

  const isDayDisabled = (day: number) => {
    if (!minDate) return false;
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split("T")[0] < minDate;
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const displayVal = value ? value : "اختر التاريخ";

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-gold-500/25 px-4 py-3 text-sm transition hover:border-gold-400"
        style={{ background: "var(--input-bg)", color: "var(--page-text)" }}
      >
        <span className={value ? "" : "opacity-60"}>{displayVal}</span>
        <Calendar className="h-4 w-4 text-gold-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 w-full min-w-[280px] rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                borderColor: "rgba(201,162,39,0.3)",
                background: "color-mix(in oklab, var(--page-bg) 88%, black 12%)",
              }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gold-500/20 bg-gold-500/5">
                <button type="button" onClick={prevMonth} className="p-1 hover:text-gold-400 transition"><ArrowRight className="h-4 w-4" /></button>
                <span className="font-bold text-sm text-gold-300" style={{ fontFamily: "var(--font-cairo)" }}>{monthName} {year}</span>
                <button type="button" onClick={nextMonth} className="p-1 hover:text-gold-400 transition"><ArrowLeft className="h-4 w-4" /></button>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-7 text-center text-xs font-bold mb-2 text-gold-400/80">
                  <span>أ</span><span>ا</span><span>ث</span><span>أ</span><span>خ</span><span>ج</span><span>س</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isDayDisabled(day);
                    const selected = value && new Date(value).getDate() === day && new Date(value).getMonth() === viewDate.getMonth() && new Date(value).getFullYear() === viewDate.getFullYear();
                    
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleDayClick(day)}
                        className={`flex h-8 w-8 mx-auto items-center justify-center rounded-full text-sm transition-all
                          ${disabled ? "opacity-20 cursor-not-allowed" : "hover:bg-gold-500/20"}
                          ${selected ? "bg-gold-500 text-black font-bold shadow-lg shadow-gold-500/30 hover:bg-gold-400" : ""}
                        `}
                        style={!selected && !disabled ? { color: "var(--page-text)" } : undefined}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── main modal ─────────────────────────── */
interface Props { open: boolean; onClose: () => void; }

export function TravelBookingModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [kind, setKind] = useState<TripKind>("round");
  const [from, setFrom] = useState("الكويت");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seat, setSeat] = useState<SeatClass>("economy");
  const [notes, setNotes] = useState("");

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return !!to && !!depart;
    if (step === 2) return adults >= 1;
    return true;
  };

  const inputCls =
    "w-full rounded-xl border border-gold-500/25 px-4 py-3 text-sm outline-none focus:border-gold-400 transition";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border shadow-2xl md:inset-0 md:m-auto md:max-h-[90dvh] md:rounded-3xl"
            style={{
              background: "color-mix(in oklab, var(--page-bg) 88%, black 12%)",
              borderColor: "rgba(201,162,39,0.22)",
              color: "var(--page-text)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur"
              style={{
                borderColor: "var(--page-border-subtle)",
                background: "color-mix(in oklab, var(--page-bg) 92%, black 8%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--page-text)" }}>
                    احجز رحلتك
                  </p>
                  <p className="text-xs" style={{ color: "var(--page-text-dim)" }}>
                    يُرسل تلقائياً عبر واتساب
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border hover:border-gold-500/30 hover:text-gold-400 transition"
                style={{ borderColor: "var(--page-border-subtle)", color: "var(--page-text-muted)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-6 pt-5">
              <div className="flex items-center gap-1">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex flex-1 flex-col items-center gap-1">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      i < step ? "bg-gold-500 text-black" :
                      i === step ? "border-2 border-gold-500 text-gold-400" :
                      ""
                    }`}>
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span
                      className={`text-[10px] ${i === step ? "text-gold-400" : ""}`}
                      style={i === step ? undefined : { color: "var(--page-text-dim)" }}
                    >
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className={`absolute hidden`} />
                    )}
                  </div>
                ))}
              </div>
              {/* progress bar */}
              <div className="mt-3 h-1 w-full rounded-full" style={{ background: "var(--page-surface)" }}>
                <motion.div className="h-full rounded-full bg-gold-500"
                  animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* Step 0 — Trip Kind */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="mb-6 text-xl font-bold" style={{ color: "var(--page-text)" }}>
                      ما نوع رحلتك؟
                    </h2>
                    <div className="grid gap-3">
                      {TRIP_KINDS.map(k => (
                        <button key={k.value} onClick={() => setKind(k.value)} type="button"
                          className={`flex items-center gap-4 rounded-2xl border p-5 text-right transition ${
                            kind === k.value
                              ? "border-gold-500/60 bg-gold-500/10"
                              : "hover:border-gold-500/25"
                          }`}
                          style={
                            kind === k.value
                              ? { background: "rgba(201,162,39,0.06)" }
                              : { borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }
                          }
                        >
                          <span className="text-2xl">{k.icon}</span>
                          <div className="flex-1">
                            <p
                              className={`font-semibold ${kind === k.value ? "text-gold-300" : ""}`}
                              style={kind === k.value ? undefined : { color: "var(--page-text)" }}
                            >
                              {k.label}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--page-text-dim)" }}>
                              {k.value === "one-way" && "تذكرة في اتجاه واحد"}
                              {k.value === "round" && "تذكرة ذهاب وعودة بتاريخ محدد"}
                              {k.value === "package" && "تذكرة + فندق + برنامج سياحي"}
                            </p>
                          </div>
                          {kind === k.value && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500">
                              <Check className="h-3.5 w-3.5 text-black" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 1 — Route & Dates */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--page-text)" }}>
                      المسار والتواريخ
                    </h2>

                    <div>
                      <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
                        من (مدينة المغادرة)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
                        <input
                          className={inputCls + " pr-10"}
                          style={{ background: "var(--input-bg)", color: "var(--page-text)" }}
                          value={from}
                          onChange={e => setFrom(e.target.value)} placeholder="الكويت" />
                      </div>
                    </div>

                    <DestSelect label="إلى (الوجهة)" value={to} onChange={setTo} />

                    <div className={`grid gap-4 ${kind === "round" ? "md:grid-cols-2" : ""}`}>
                      <div>
                        <CustomDatePicker 
                          label="تاريخ الذهاب" 
                          value={depart} 
                          onChange={setDepart} 
                          minDate={new Date().toISOString().split("T")[0]} 
                        />
                      </div>
                      {kind === "round" && (
                        <div>
                          <CustomDatePicker 
                            label="تاريخ العودة" 
                            value={ret} 
                            onChange={setRet} 
                            minDate={depart || new Date().toISOString().split("T")[0]} 
                          />
                        </div>
                      )}
                    </div>

                    {kind === "package" && (
                      <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4">
                        <p className="flex items-center gap-2 text-sm text-gold-300">
                          <Sparkles className="h-4 w-4" />
                          الباقة الشاملة تتضمن: تذاكر طيران + فندق + برنامج سياحي + تأمين سفر
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--page-text-dim)" }}>
                          سيتواصل معك أحد مستشارينا لتصميم الباقة المثالية
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2 — Passengers & Seat */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--page-text)" }}>
                      المسافرون والدرجة
                    </h2>

                    <div className="space-y-3">
                      <Counter label="البالغون" sub="+12 سنة" value={adults} onChange={setAdults} min={1} />
                      <Counter label="الأطفال" sub="2–11 سنة" value={children} onChange={setChildren} />
                      <Counter label="الرضّع" sub="أقل من سنتين" value={infants} onChange={setInfants} />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium" style={{ color: "var(--page-text-muted)" }}>
                        درجة المقعد
                      </p>
                      <div className="grid gap-3">
                        {SEAT_CLASSES.map(s => (
                          <button key={s.value} onClick={() => setSeat(s.value)} type="button"
                            className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                              seat === s.value
                                ? "border-gold-500/60 bg-gold-500/10"
                                : "hover:border-gold-500/20"
                            }`}
                            style={
                              seat === s.value
                                ? { background: "rgba(201,162,39,0.06)" }
                                : { borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }
                            }
                          >
                            <span className="text-xl">{s.icon}</span>
                            <div className="flex-1 text-right">
                              <p
                                className={`text-sm font-semibold ${seat === s.value ? "text-gold-300" : ""}`}
                                style={seat === s.value ? undefined : { color: "var(--page-text)" }}
                              >
                                {s.label}
                              </p>
                              <p className="text-xs" style={{ color: "var(--page-text-dim)" }}>
                                {s.sub}
                              </p>
                            </div>
                            {seat === s.value && <Check className="h-4 w-4 text-gold-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Confirm */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--page-text)" }}>
                      مراجعة وتأكيد
                    </h2>

                    <div
                      className="rounded-2xl border p-5 space-y-3"
                      style={{
                        borderColor: "rgba(201,162,39,0.16)",
                        background: "var(--page-surface)",
                      }}
                    >
                      {[
                        { icon: "✈️", label: "نوع الرحلة", val: TRIP_KINDS.find(k => k.value === kind)?.label },
                        { icon: "🛫", label: "من", val: from },
                        { icon: "🛬", label: "إلى", val: DESTINATIONS.find(d => d.city === to) ? `${DESTINATIONS.find(d => d.city === to)?.emoji} ${to}` : "—" },
                        { icon: "📅", label: "الذهاب", val: depart || "لم يُحدد" },
                        ...(kind === "round" ? [{ icon: "📅", label: "العودة", val: ret || "لم يُحدد" }] : []),
                        { icon: "👥", label: "المسافرون", val: `${adults} بالغ${children ? ` + ${children} طفل` : ""}${infants ? ` + ${infants} رضيع` : ""}` },
                        { icon: "💺", label: "الدرجة", val: SEAT_CLASSES.find(s => s.value === seat)?.label },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                          <span style={{ color: "var(--page-text-dim)" }}>
                            {row.icon} {row.label}
                          </span>
                          <span className="font-medium" style={{ color: "var(--page-text)" }}>
                            {row.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
                        ملاحظات إضافية (اختياري)
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-gold-500/25 px-4 py-3 text-sm outline-none focus:border-gold-400 transition min-h-[80px] resize-none"
                        style={{ background: "var(--input-bg)", color: "var(--page-text)" }}
                        placeholder="أي طلبات خاصة، تفضيلات المقعد، احتياجات خاصة…"
                        value={notes} onChange={e => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4">
                      <p className="flex items-center gap-2 text-xs text-gold-300">
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        عند الضغط على "احجز الآن" سيُفتح واتساب تلقائياً مع كافة تفاصيل رحلتك — يرد فريقنا خلال دقائق.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="sticky bottom-0 border-t px-6 py-4 backdrop-blur"
              style={{
                borderColor: "var(--page-border-subtle)",
                background: "color-mix(in oklab, var(--page-bg) 92%, black 8%)",
              }}
            >
              <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={() => setStep(s => (s - 1) as Step)} type="button"
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm hover:border-gold-500/30 transition"
                    style={{ borderColor: "var(--page-border-subtle)", color: "var(--page-text-muted)" }}
                  >
                    <ArrowRight className="h-4 w-4" /> رجوع
                  </button>
                )}

                {step < 3 ? (
                  <button onClick={() => { if (canNext()) setStep(s => (s + 1) as Step); }} type="button"
                    disabled={!canNext()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-bold text-black transition hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed">
                    التالي <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <a href={buildWA({ kind, from, to, depart, ret, adults, children, infants, seat, notes })}
                    target="_blank" rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-bold text-black transition hover:bg-gold-400">
                    <MessageCircle className="h-4 w-4" />
                    احجز الآن عبر واتساب
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                )}
              </div>
              {!canNext() && step === 1 && (
                <p className="mt-2 text-center text-xs text-red-400">يرجى تحديد الوجهة وتاريخ الذهاب للمتابعة</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
