"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { GlobeMarker } from "@/components/ui/3d-globe";
import { getRotationForLatLng } from "@/components/ui/3d-globe";
import { useCurrency } from "@/context/CurrencyContext";

type Destination = {
  id: string;
  city: string;
  country: string;
  price: string;
  duration: string;
  lat: number;
  lng: number;
  img: string;
  highlights: string[];
};

const defaultDestinations: Destination[] = [
  {
    id: "egypt-cairo",
    city: "القاهرة",
    country: "مصر",
    price: "120",
    duration: "4 أيام",
    lat: 30.0444,
    lng: 31.2357,
    img: "/assets/destinations/egypt.png",
    highlights: ["جولات ثقافية", "إقامة فاخرة", "تنقل مريح"],
  },
  {
    id: "jordan-petra",
    city: "البتراء",
    country: "الأردن",
    price: "95",
    duration: "3 أيام",
    lat: 30.3285,
    lng: 35.4444,
    img: "/assets/destinations/jordan.png",
    highlights: ["مرشد سياحي", "تجربة تاريخية", "تنظيم يومي"],
  },
  {
    id: "uk-london",
    city: "لندن",
    country: "المملكة المتحدة",
    price: "210",
    duration: "6 أيام",
    lat: 51.5072,
    lng: -0.1276,
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    highlights: ["فنادق 5 نجوم", "زيارات مميزة", "خدمة VIP"],
  },
  {
    id: "turkey-istanbul",
    city: "اسطنبول",
    country: "تركيا",
    price: "145",
    duration: "5 أيام",
    lat: 41.0082,
    lng: 28.9784,
    img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    highlights: ["رحلات بحرية", "أسواق تقليدية", "جدول مرن"],
  },
  {
    id: "maldives",
    city: "جزر المالديف",
    country: "المالديف",
    price: "350",
    duration: "7 أيام",
    lat: 3.2028,
    lng: 73.2207,
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    highlights: ["فلل فوق الماء", "أنشطة بحرية", "خصوصية عالية"],
  },
];

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((module) => module.Globe3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[460px] w-full items-center justify-center rounded-3xl border"
        style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text-muted)" }}
      >
        جارٍ تحميل الكرة الأرضية...
      </div>
    ),
  }
);

export function HorizontalDestinations() {
  const { formatPrice } = useCurrency();
  const [dests, setDests] = useState<Destination[]>(defaultDestinations);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations && data.destinations.length > 0) {
          const mapped = data.destinations.filter((d: any) => d.active).map((d: any, idx: number) => {
            const fallback = defaultDestinations.find(fd => d.name.includes(fd.city)) || defaultDestinations[idx % defaultDestinations.length];
            return {
              id: d.id || String(idx),
              city: d.name.split("،")[0] || d.name,
              country: d.name.split("،")[1] || "",
              price: "120",
              duration: "5 أيام",
              lat: fallback?.lat || 0,
              lng: fallback?.lng || 0,
              img: d.img,
              highlights: ["جولات ثقافية", "إقامة فاخرة", "تنقل مريح"],
            };
          });
          if (mapped.length > 0) setDests(mapped);
        }
      })
      .catch(console.error);
  }, []);

  const activeDestination = dests[activeIndex] || dests[0];

  const goToDestination = (direction: "next" | "prev") => {
    setActiveIndex((prev) => {
      if (direction === "next") return (prev + 1) % dests.length;
      return (prev - 1 + dests.length) % dests.length;
    });
  };

  const markers = useMemo<GlobeMarker[]>(() => {
    return dests.map((destination) => ({
      id: destination.id,
      lat: destination.lat,
      lng: destination.lng,
      src: destination.img,
      label: `${destination.country} - ${destination.city}`,
      size: destination.id === activeDestination?.id ? 0.17 : 0.13,
      color: destination.id === activeDestination?.id ? "#FCD34D" : "#ffffff",
    }));
  }, [activeDestination?.id, dests]);

  const handleMarkerClick = (marker: GlobeMarker) => {
    const nextIndex = marker.id
      ? dests.findIndex((destination) => destination.id === marker.id)
      : dests.findIndex(
          (destination) => destination.lat === marker.lat && destination.lng === marker.lng,
        );
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  };

  const targetRotation = useMemo(() => {
    return getRotationForLatLng(activeDestination?.lat || 0, activeDestination?.lng || 0, 1);
  }, [activeDestination?.id]);

  if (!activeDestination) return null;

  return (
    <section
      id="destinations"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--section-alt-bg)", color: "var(--page-text)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-amber-400/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="inline-flex items-center rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1 text-sm text-gold-300">
              تجربة تفاعلية على الخريطة
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl" style={{ color: "var(--page-text)" }}>
              اختر رحلتك من الكرة الأرضية
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg" style={{ color: "var(--page-text-muted)" }}>
              كل نقطة على الخريطة تمثل وجهة حقيقية. اضغط على الدولة لتظهر لك التفاصيل والسعر والخدمات مباشرة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToDestination("prev")}
              suppressHydrationWarning
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border transition hover:border-gold-400/60 hover:text-gold-300"
              style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text)" }}
              aria-label="السابق"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToDestination("next")}
              suppressHydrationWarning
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border transition hover:border-gold-400/60 hover:text-gold-300"
              style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text)" }}
              aria-label="التالي"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-gold-500/10 blur-[120px]" />
            <Globe3D
              className="h-[460px]"
              markers={markers}
              onMarkerClick={handleMarkerClick}
              config={{
                radius: 2,
                autoRotateSpeed: 0.32,
                showAtmosphere: true,
                atmosphereColor: "#facc15",
                atmosphereIntensity: 0.45,
                atmosphereBlur: 3.8,
                showWireframe: true,
                wireframeColor: "#facc15",
                enableZoom: true,
                enablePan: false,
                minDistance: 4.6,
                maxDistance: 9,
                initialRotation: {
                  x: targetRotation.x,
                  y: targetRotation.y,
                },
              }}
            />
            <div
              className="pointer-events-none absolute bottom-3 left-1/2 w-[80%] -translate-x-1/2 rounded-full p-3 text-center text-sm backdrop-blur"
              style={{
                background: "color-mix(in oklab, var(--page-bg) 78%, black 22%)",
                color: "var(--page-text)",
                border: "1px solid var(--page-border-subtle)",
              }}
            >
              <span className="text-gold-300">{activeDestination?.country}</span> - {activeDestination?.city}
            </div>
          </motion.div>

          <motion.article
            key={activeDestination?.city}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl border p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur md:p-5"
            style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text)" }}
          >
            <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[290px]">
              <Image
                src={activeDestination?.img || "/assets/destinations/egypt.png"}
                alt={activeDestination?.city || "Destination"}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
            </div>

            <div className="mt-5 px-2">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text)" }}
              >
                <MapPin className="h-4 w-4 text-gold-300" />
                {activeDestination?.country}
              </div>

              <h3 className="text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
                {activeDestination?.city}
              </h3>

              <div className="mt-4 flex items-center justify-between" style={{ color: "var(--page-text-muted)" }}>
                <p>{activeDestination?.duration}</p>
                <p className="text-gold-300 flex items-center gap-1" dir="rtl">
                  ابتداءً من <span className="text-2xl font-bold" dir="ltr">{formatPrice(Number(activeDestination?.price || 0))}</span>
                </p>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {activeDestination?.highlights?.map((item: string) => (
                  <div
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text)" }}
                  >
                    <Sparkles className="h-4 w-4 text-gold-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {dests.map((destination: any, index: number) => (
            <button
              key={destination.id}
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                index === activeIndex
                  ? "border-gold-400/50 bg-gold-400 text-black shadow-lg"
                  : "border-white/10 hover:border-gold-400/40 hover:bg-white/5"
              }`}
            >
              {destination.city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
