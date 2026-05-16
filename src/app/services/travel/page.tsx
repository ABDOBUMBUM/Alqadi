"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Hotel, Users, Calendar, ArrowRight, ArrowLeft,
  MessageCircle, ChevronLeft, MapPin, Star, Check,
  Globe2, Ticket, Shield, Clock, Sparkles, HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Ticket,
  Shield,
  Clock,
  Globe2,
  Plane,
  Hotel,
  Users,
  Calendar,
  Sparkles,
};

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

// ─── Booking Form ───────────────────────────────────────────────
const destinations = [
  "لندن — المملكة المتحدة", "باريس — فرنسا", "إسطنبول — تركيا",
  "دبي — الإمارات", "القاهرة — مصر", "كوالالمبور — ماليزيا",
  "بانكوك — تايلاند", "روما — إيطاليا", "برشلونة — إسبانيا",
  "أمستردام — هولندا", "زيورخ — سويسرا", "طوكيو — اليابان",
  "نيويورك — أمريكا", "ماليبو — المالديف", "أبوظبي — الإمارات",
];

const seatTypes = [
  { value: "economy", label: "اقتصادي", icon: "💺" },
  { value: "business", label: "رجال أعمال", icon: "🛋️" },
  { value: "first", label: "درجة أولى", icon: "👑" },
];

const tripTypes = [
  { value: "one-way", label: "ذهاب فقط" },
  { value: "round", label: "ذهاب وعودة" },
  { value: "package", label: "باقة شاملة" },
];

function FlightBookingWidget({ waPhone, destinationOptions, cmsTravel }: { waPhone: string; destinationOptions: string[], cmsTravel?: any }) {
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("الكويت");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [seat, setSeat] = useState("economy");

  function buildWaMessage() {
    const seatLabel = seatTypes.find(s => s.value === seat)?.label ?? seat;
    const tripLabel = tripTypes.find(t => t.value === tripType)?.label ?? tripType;
    const pax = `${adults} بالغ${children > 0 ? ` + ${children} طفل` : ""}`;
    let msg = `مرحباً، أود حجز رحلة:\n`;
    msg += `✈️ النوع: ${tripLabel}\n`;
    msg += `🛫 من: ${from}\n`;
    msg += `🛬 إلى: ${to || "سيتم التحديد"}\n`;
    msg += `📅 تاريخ الذهاب: ${depart || "سيتم التحديد"}\n`;
    if (tripType === "round") msg += `📅 تاريخ العودة: ${returnDate || "سيتم التحديد"}\n`;
    msg += `👥 المسافرون: ${pax}\n`;
    msg += `💺 الدرجة: ${seatLabel}\n`;
    msg += `أرجو التواصل لتأكيد الحجز.`;
    return `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(msg)}`;
  }

  const inputCls =
    "w-full rounded-xl border border-gold-500/25 px-4 py-3 text-sm outline-none focus:border-gold-400 transition";
  const selectCls =
    "w-full rounded-xl border border-gold-500/25 px-4 py-3 text-sm outline-none focus:border-gold-400 transition appearance-none";

  return (
    <div
      className="rounded-3xl border border-gold-500/25 p-6 backdrop-blur-xl md:p-8"
      style={{ background: "color-mix(in oklab, var(--page-bg) 55%, black 45%)" }}
    >
      <div className="mb-6 flex items-center gap-2">
        <Plane className="h-5 w-5 text-gold-400" />
        <h2 className="text-xl font-bold" style={{ color: "var(--page-text)" }}>
          {cmsTravel?.bookingTitle || "احجز رحلتك الآن"}
        </h2>
        <span className="mr-auto flex items-center gap-1 text-xs text-gold-400">
          <Sparkles className="h-3 w-3" /> {cmsTravel?.bookingSubtitle || "يُرسل الطلب مباشرة عبر واتساب"}
        </span>
      </div>

      {/* Trip type */}
      <div className="mb-6 flex gap-2">
        {tripTypes.map(t => (
          <button key={t.value} onClick={() => setTripType(t.value)}
            className={`flex-1 rounded-xl border py-2.5 text-sm transition ${tripType === t.value
                ? "border-gold-500/60 bg-gold-500/15 text-gold-300 font-semibold"
                : "border-white/10 hover:border-gold-500/30"
              }`}
            style={tripType !== t.value ? { color: "var(--page-text-muted)" } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Route */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            من (المغادرة)
          </label>
          <input
            className={inputCls}
            style={{
              background: "var(--input-bg)",
              color: "var(--page-text)",
            }}
            value={from}
            onChange={e => setFrom(e.target.value)} placeholder="مدينة المغادرة" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            إلى (الوجهة)
          </label>
          <select
            className={selectCls}
            style={{
              background: "var(--input-bg)",
              color: "var(--page-text)",
            }}
            value={to}
            onChange={e => setTo(e.target.value)}
          >
            <option value="">اختر الوجهة</option>
            {(destinationOptions.length > 0 ? destinationOptions : destinations).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            تاريخ الذهاب
          </label>
          <input
            type="date"
            className={inputCls}
            style={{
              background: "var(--input-bg)",
              color: "var(--page-text)",
            }}
            value={depart}
            onChange={e => setDepart(e.target.value)} />
        </div>
        <AnimatePresence>
          {tripType === "round" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
                تاريخ العودة
              </label>
              <input
                type="date"
                className={inputCls}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--page-text)",
                }}
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Passengers + Seat */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            عدد البالغين
          </label>
          <div
            className="flex items-center gap-3 rounded-xl border border-gold-500/25 px-4 py-2.5"
            style={{ background: "var(--input-bg)" }}
          >
            <button onClick={() => setAdults(Math.max(1, adults - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15">−</button>
            <span className="flex-1 text-center text-sm font-bold" style={{ color: "var(--page-text)" }}>
              {adults}
            </span>
            <button onClick={() => setAdults(Math.min(9, adults + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15">+</button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            عدد الأطفال
          </label>
          <div
            className="flex items-center gap-3 rounded-xl border border-gold-500/25 px-4 py-2.5"
            style={{ background: "var(--input-bg)" }}
          >
            <button onClick={() => setChildren(Math.max(0, children - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15">−</button>
            <span className="flex-1 text-center text-sm font-bold" style={{ color: "var(--page-text)" }}>
              {children}
            </span>
            <button onClick={() => setChildren(Math.min(6, children + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/15">+</button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs" style={{ color: "var(--page-text-muted)" }}>
            درجة المقعد
          </label>
          <div className="grid grid-cols-3 gap-1">
            {seatTypes.map(s => (
              <button key={s.value} onClick={() => setSeat(s.value)}
                className={`rounded-xl border py-2 text-center text-xs transition ${seat === s.value
                    ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
                    : "border-white/10 hover:border-gold-500/20"
                  }`}
                style={seat !== s.value ? { color: "var(--page-text-muted)" } : undefined}
              >
                <span className="block text-base">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <a href={buildWaMessage()} target="_blank" rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gold-500 py-4 text-base font-bold text-black transition hover:bg-gold-400 active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" />
        احجز الآن عبر واتساب
        <ArrowLeft className="h-4 w-4" />
      </a>
      <p className="mt-3 text-center text-xs" style={{ color: "var(--page-text-dim)" }}>
        سيفتح تطبيق واتساب تلقائياً مع تفاصيل رحلتك — فريقنا يرد خلال دقائق
      </p>
    </div>
  );
}

// ─── Destinations ────────────────────────────────────────────────
const featuredDests = [
  { city: "لندن", country: "المملكة المتحدة", price: "من $210", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80", rating: 4.9, trips: "2,100+ رحلة" },
  { city: "إسطنبول", country: "تركيا", price: "من $145", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=700&q=80", rating: 4.8, trips: "3,400+ رحلة" },
  { city: "باريس", country: "فرنسا", price: "من $175", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80", rating: 4.9, trips: "1,800+ رحلة" },
  { city: "دبي", country: "الإمارات", price: "من $190", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80", rating: 4.7, trips: "5,200+ رحلة" },
  { city: "كوالالمبور", country: "ماليزيا", price: "من $130", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=700&q=80", rating: 4.7, trips: "1,200+ رحلة" },
  { city: "القاهرة", country: "مصر", price: "من $90", img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=700&q=80", rating: 4.6, trips: "4,100+ رحلة" },
];

const packages = [
  { name: "باقة أوروبا الملكية", discount: "خصم 22%", nights: "10 ليالٍ", includes: ["تذاكر طيران", "فندق 5 نجوم", "تأمين سفر", "مرشد سياحي"], price: "من $2,800", hot: true },
  { name: "برنامج الصيف الذهبي", discount: "خصم 18%", nights: "7 ليالٍ", includes: ["تذاكر طيران", "فندق 4 نجوم", "إفطار يومي", "نقل"], price: "من $1,600", hot: false },
  { name: "Business Elite", discount: "VIP", nights: "5 ليالٍ", includes: ["درجة أولى", "فندق فاخر", "استقبال VIP", "مدير رحلة خاص"], price: "من $4,500", hot: false },
];

const whyUs = [
  { icon: Ticket, title: "أسعار تنافسية", desc: "نضمن أفضل سعر مع إمكانية المقارنة" },
  { icon: Shield, title: "حجز آمن ومضمون", desc: "تأكيد فوري مع ضمان استرداد كامل" },
  { icon: Clock, title: "دعم 24/7", desc: "فريقنا متاح على مدار الساعة عبر واتساب" },
  { icon: Globe2, title: "+150 وجهة", desc: "شبكة واسعة من الوجهات السياحية العالمية" },
];

export default function TravelPage() {
  const [dests, setDests] = useState<any[]>(featuredDests);
  const [pkgs, setPkgs] = useState<any[]>(packages);
  const [_whyUs, setWhyUs] = useState<any[]>(whyUs);
  const [cmsTravel, setCmsTravel] = useState<any>({});
  const [waPhone, setWaPhone] = useState("96598765432");
  const [heroTitle, setHeroTitle] = useState("سافر بأسلوب مجموعة القاضي الذهبي");
  const [heroDesc, setHeroDesc] = useState("خبرة 45 عاماً في مجموعة القاضي الذهبية لتصميم تجارب سفر لا تُنسى — من حجز التذكرة حتى العودة آمناً.");
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80");
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.company?.whatsapp) setWaPhone(String(data.company.whatsapp));
        if (data.destinations && data.destinations.length > 0) {
          // Map DB destinations to the format expected by the page
          const mappedDests = data.destinations
            .filter((d: any) => d.active)
            .map((d: any) => ({
              city: d.name.split("،")[0] || d.name,
              country: d.name.split("،")[1] || "",
              price: "عرض خاص",
              img: d.img,
              rating: d.popular ? 4.9 : 4.5,
              trips: "متاح للحجز",
            }));
          if (mappedDests.length > 0) setDests(mappedDests);
          const options = data.destinations
            .filter((d: any) => d.active)
            .map((d: any) => d.name)
            .filter(Boolean);
          setDestinationOptions(options);
        }

        if (data.packages && data.packages.length > 0) {
          // Map DB packages
          const mappedPkgs = data.packages.map((p: any) => ({
            name: p.title,
            discount: p.isHot ? "VIP" : "متاح",
            nights: p.nights,
            includes: Array.isArray(p.includes)
              ? p.includes.map((s: any) => String(s).trim())
              : typeof p.includes === "string" && p.includes
              ? p.includes.split("،").map((s: string) => s.trim())
              : [],
            price: `من $${p.price}`,
            hot: p.isHot,
          }));
          if (mappedPkgs.length > 0) setPkgs(mappedPkgs);
        }
        if (data.cms_travel) {
          setCmsTravel(data.cms_travel);
          if (data.cms_travel.whyUs) {
            const mappedWhyUs = data.cms_travel.whyUs.map((item: any, idx: number) => ({
              ...item,
              icon: ICON_MAP[item.icon] || whyUs[idx % whyUs.length]?.icon || Ticket
            }));
            setWhyUs(mappedWhyUs);
          }
          if (data.cms_travel.heroTitle) setHeroTitle(data.cms_travel.heroTitle);
          if (data.cms_travel.heroDesc) setHeroDesc(data.cms_travel.heroDesc);
          if (data.cms_travel.heroImage) setHeroImage(data.cms_travel.heroImage);
        }
      })
      .catch((err) => console.error("Failed to fetch travel content", err));
  }, []);

  return (
    <div className="relative min-h-screen pt-24 marble-bg" style={{ color: "var(--page-text)" }}>

      {/* Hero with Booking Widget */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src={heroImage}
            alt="السفر والسياحة" fill className="object-cover opacity-30" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,4,4,0.55) 0%, rgba(5,4,4,0.35) 55%, rgba(5,4,4,0.92) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-xs tracking-[0.4em] text-gold-400">TRAVEL & TOURISM</p>
              <h1 className="mt-4 text-4xl font-black md:text-6xl leading-tight" style={{ color: "var(--page-text)" }}>
                {heroTitle}
              </h1>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {heroDesc}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {(cmsTravel?.heroTags || ["+150 وجهة", "+45 سنة خبرة", "دعم 24/7", "أفضل الأسعار"]).map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300">
                    <Check className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Booking Widget */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <FlightBookingWidget waPhone={waPhone} destinationOptions={destinationOptions} cmsTravel={cmsTravel} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {_whyUs.map((item: any, i: number) => (
            <motion.div key={item.title + i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-5 text-center"
              style={{ background: "var(--page-surface)", borderColor: "rgba(201,162,39,0.16)" }}
            >
              {item.icon ? (
                <item.icon className="mx-auto mb-3 h-7 w-7 text-gold-400" />
              ) : (
                <Ticket className="mx-auto mb-3 h-7 w-7 text-gold-400" />
              )}
              <h3 className="font-bold text-sm" style={{ color: "var(--page-text)" }}>
                {item.title}
              </h3>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <motion.div {...reveal} className="mb-10">
          <p className="text-xs tracking-[0.35em] text-gold-400">TOP DESTINATIONS</p>
          <h2 className="mt-3 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
            {cmsTravel?.destinationsTitle || "الوجهات الأكثر طلباً"}
          </h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dests.map((dest, i) => (
            <motion.article key={dest.city}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-gold-500/15"
            >
              <div className="relative h-56">
                <Image src={dest.img} alt={dest.city} fill sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">{dest.city}</h3>
                      <p className="flex items-center gap-1 text-xs text-white/60">
                        <MapPin className="h-3 w-3 text-gold-400" /> {dest.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold-400">{dest.price}</p>
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                        <span className="text-xs text-white/60">{dest.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white/40">{dest.trips}</p>
                </div>
              </div>
              <div className="p-4" style={{ background: "color-mix(in oklab, var(--page-bg) 68%, black 32%)" }}>
                <a href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(`مرحباً، أود الاستفسار عن رحلة إلى ${dest.city} — ${dest.country}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/25 py-2.5 text-sm text-gold-300 transition hover:bg-gold-500/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  احجز لـ {dest.city}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...reveal} className="mb-10 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">PACKAGES</p>
            <h2 className="mt-3 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              {cmsTravel?.packagesTitle || "الباقات السياحية"}
            </h2>
            <p className="mt-2" style={{ color: "var(--page-text-muted)" }}>
              {cmsTravel?.packagesSubtitle || "باقات شاملة بأفضل الأسعار"}
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {pkgs.map((pkg, i) => (
              <motion.div key={pkg.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`gold-glow-card rounded-3xl border p-6 ${pkg.hot ? "" : ""}`}
                style={{
                  borderColor: pkg.hot ? "rgba(201,162,39,0.42)" : "rgba(201,162,39,0.16)",
                  background: pkg.hot ? "rgba(201,162,39,0.06)" : "var(--page-surface)",
                }}
              >
                {pkg.hot && (
                  <span className="mb-3 inline-block rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-1 text-xs font-bold text-gold-300">
                    🔥 الأكثر طلباً
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold" style={{ color: "var(--page-text)" }}>
                    {pkg.name}
                  </h3>
                  <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs text-gold-300 border border-gold-500/25">{pkg.discount}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                  <Calendar className="h-3 w-3 text-gold-400" /> {pkg.nights}
                </p>
                <ul className="mt-4 space-y-2">
                  {pkg.includes.map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                      <Check className="h-4 w-4 text-gold-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t pt-5" style={{ borderColor: "var(--page-border-subtle)" }}>
                  <p className="text-lg font-bold text-gold-400">{pkg.price}</p>
                  <a href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(`مرحباً، أود الاستفسار عن: ${pkg.name}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-gold-500/15 border border-gold-500/30 px-4 py-2 text-sm text-gold-300 transition hover:bg-gold-500/25"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    احجز الباقة
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div {...reveal} className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-10">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
            {cmsTravel?.ctaTitle || "لا تعرف أين تسافر؟ دع مجموعة القاضي تخطط لك"}
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            {cmsTravel?.ctaDesc || "فريق خبراء السياحة في مجموعة القاضي يصمم لك رحلة مثالية بناءً على ميزانيتك وتفضيلاتك."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent("مرحباً، أحتاج مساعدة في اختيار وجهة سفر مناسبة")}`}
              target="_blank" rel="noopener noreferrer" className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              استشر خبيرنا السياحي
            </a>
            <Link href="/" className="btn-ghost-gold gap-2">
              <ChevronLeft className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
