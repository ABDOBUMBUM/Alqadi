"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Wifi,
  UtensilsCrossed,
  Car,
  Waves,
  MessageCircle,
  Phone,
  ChevronLeft,
  MapPin,
  BadgeCheck,
  Filter,
  CheckCircle,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  priceFrom: number;
  currency: string;
  amenities: string[];
  images: string[];
  featured: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "واي فاي": <Wifi className="h-3 w-3" />,
  "مطعم": <UtensilsCrossed className="h-3 w-3" />,
  "سبا": <Waves className="h-3 w-3" />,
  "بركة سباحة": <Waves className="h-3 w-3" />,
  "بركة": <Waves className="h-3 w-3" />,
  "خدمة كونسيرج": <Car className="h-3 w-3" />,
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
      ))}
      {count > 5 && <span className="ml-1 text-xs font-bold text-gold-400">+{count - 5}★</span>}
    </div>
  );
}

function HotelImageCarousel({ images, name }: { images: string[], name: string }) {
  const [index, setIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIndex((prev) => (prev + 1) % images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-52 overflow-hidden group/carousel">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt={name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      {images.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 transition-opacity group-hover/carousel:opacity-100 z-10">
          <button type="button" onClick={prev} className="p-1 rounded-full bg-black/50 text-white hover:bg-gold-500 hover:text-black transition backdrop-blur-md">
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
          <button type="button" onClick={next} className="p-1 rounded-full bg-black/50 text-white hover:bg-gold-500 hover:text-black transition backdrop-blur-md">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-gold-400" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(data => {
        // Ensure amenities and images are parsed as arrays (if Prisma didn't automatically parse JSON arrays)
        const parsedData = data.map((h: any) => ({
          ...h,
          amenities: Array.isArray(h.amenities) ? h.amenities : [],
          images: Array.isArray(h.images) ? h.images : (h.images ? [h.images] : ["/assets/hotels/default.jpg"]),
        }));
        setHotels(parsedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load hotels:", err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(201,162,39,0.10) 0%, transparent 60%)",
          }}
        />
        <motion.div {...reveal} className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-xs tracking-[0.4em] text-gold-400">LUXURY HOTELS</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            حجوزات <span className="text-gold-gradient">فنادق مجموعة القاضي</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            نختار لكم في مجموعة القاضي الذهبية أرقى الفنادق في أفضل الوجهات العالمية بأسعار تنافسية وخدمة كونسيرج شخصية متكاملة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن حجز فندق"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              احجز عبر واتساب
            </a>
            <a href="tel:+96598765432" className="btn-ghost-gold gap-2">
              <Phone className="h-4 w-4" />
              اتصل بنا
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "فندق شريك", value: "500+" },
            { label: "دولة مغطاة", value: "75+" },
            { label: "عميل راضٍ", value: "860K+" },
            { label: "سنة خبرة", value: "45+" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-gold-500/15 p-5 text-center"
              style={{ background: "var(--page-surface)" }}
            >
              <p className="text-3xl font-black text-gold-gradient">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="mx-auto max-w-7xl px-6 py-4 md:px-10">
        <motion.div {...reveal} className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-gold-400" />
          <span className="text-sm" style={{ color: "var(--page-text-muted)" }}>
            تصفية حسب:
          </span>
          {["الكل", "فاخر", "أعمال", "تراثي", "إقتصادي"].map((cat) => (
            <button
              key={cat}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                cat === "الكل"
                  ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
                  : "hover:border-gold-500/30 hover:text-gold-300"
              }`}
              style={cat === "الكل" ? undefined : { borderColor: "var(--page-border-subtle)", color: "var(--page-text-muted)" }}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Hotels Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        {loading ? (
          <div className="flex justify-center py-20 text-gold-400">جاري تحميل أحدث الفنادق...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, i) => (
              <motion.article
                key={hotel.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="gold-glow-card group overflow-hidden rounded-3xl border border-gold-500/15"
                style={{ background: "var(--page-surface)" }}
              >
                <div className="relative h-52 overflow-hidden">
                  <HotelImageCarousel images={hotel.images} name={hotel.name} />
                  {hotel.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold text-black z-10">
                      مميز
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 z-10">
                    <StarRating count={hotel.stars} />
                  </div>
                </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold" style={{ color: "var(--page-text)" }}>
                      {hotel.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                      <MapPin className="h-3 w-3 text-gold-400" />
                      {hotel.city}، {hotel.country}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gold-400 whitespace-nowrap">{hotel.priceFrom} {hotel.currency}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px]"
                      style={{ borderColor: "var(--page-border-subtle)", color: "var(--page-text-muted)" }}
                    >
                      {amenityIcons[amenity] || <CheckCircle className="h-3 w-3" />}
                      {amenity}
                    </span>
                  ))}
                </div>
                <a
                  href="https://api.whatsapp.com/send?phone=96598765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 py-2.5 text-sm text-gold-300 transition hover:bg-gold-500/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  احجز هذا الفندق
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        )}
      </section>

      {/* Why Book With Us */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...reveal} className="mb-12 text-center">
            <h2 className="text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              لماذا تحجز مع مجموعة القاضي؟
            </h2>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: BadgeCheck, title: "أفضل الأسعار المضمونة", desc: "نضمن أفضل سعر مع إمكانية الاسترداد الكامل" },
              { icon: MessageCircle, title: "دعم 24/7 عبر واتساب", desc: "فريقنا جاهز لمساعدتك في أي وقت ومن أي مكان" },
              { icon: Star, title: "فنادق مختارة بعناية", desc: "كل فندق يمر بمعايير صارمة للجودة والخدمة" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gold-500/15 p-6 text-center"
                style={{ background: "var(--page-surface)" }}
              >
                <item.icon className="mx-auto mb-3 h-8 w-8 text-gold-400" />
                <h3 className="font-bold" style={{ color: "var(--page-text)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          {...reveal}
          className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-10"
        >
          <h2 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
            لم تجد الفندق المناسب؟
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            تواصل مع فريق مجموعة القاضي وسنقوم بإيجاد الخيار المثالي لك وفق ميزانيتك ومتطلباتك الخاصة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن حجز فندق"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل مع مستشارنا
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
