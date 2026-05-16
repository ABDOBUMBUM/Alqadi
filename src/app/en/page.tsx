import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Plane, Users, Hotel, BadgeCheck, MessageCircle, Phone, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Golden Al'Qadi Group | Luxury Travel, Tourism & Manpower — Kuwait",
  description:
    "Golden Al'Qadi Group — 45 years of excellence in luxury travel, tourism packages, visa services, hotel bookings, and manpower solutions across the Gulf region.",
  alternates: { canonical: "/en", languages: { ar: "/", en: "/en" } },
};

const defaultServices = [
  { icon: Plane, title: "Travel & Tourism", desc: "Premium flight bookings, curated tour packages, and personalized travel experiences to 150+ global destinations.", href: "/services/travel" },
  { icon: Globe2, title: "Visa Services", desc: "Fast, reliable visa processing for 30+ countries — with urgent, express and standard processing options.", href: "/services/visa" },
  { icon: Hotel, title: "Luxury Hotels", desc: "Hand-picked 4 & 5-star hotels worldwide with exclusive rates and special amenities.", href: "/services/hotels" },
  { icon: Users, title: "Manpower Services", desc: "Connecting top talent with leading companies across the Gulf region — from recruitment to placement.", href: "/services/manpower" },
];

const defaultStats = [
  { value: "860K+", label: "Happy Clients" },
  { value: "45+", label: "Years Experience" },
  { value: "75+", label: "Countries Covered" },
  { value: "ISO 9001", label: "Certified Quality" },
];

export default async function EnglishHome() {
  const cms = await getCmsData("en_home") || {};
  let waPhone = "96598765432";
  try {
    const companySetting = await prisma.siteSetting.findUnique({ where: { key: "company" } });
    waPhone = String((companySetting?.value as any)?.whatsapp || waPhone);
  } catch {
    // DB unavailable at build time — use default
  }
  const phoneDisplay = `+${waPhone}`;
  
  const services = cms?.services?.length > 0 ? cms.services : defaultServices;
  const stats = cms?.stats?.length > 0 ? cms.stats : defaultStats;

  return (
    <div
      dir="ltr"
      lang="en"
      className="min-h-screen pt-24 marble-bg"
      style={{ color: "var(--page-text)" }}
    >

      {/* Hero */}
      <section className="relative overflow-hidden py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(201,162,39,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-xs tracking-[0.4em] text-gold-400">{cms?.heroTagline || "GOLDEN AL'QADI GROUP — SINCE 1980"}</p>
          <h1 className="mt-4 text-5xl font-black md:text-7xl" style={{ color: "var(--page-text)" }}>
            {cms?.heroTitlePart1 || "Travel in"} <span className="text-gold-gradient">{cms?.heroTitlePart2 || "Golden Style"}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: "var(--page-text-muted)" }}>
            {cms?.heroSubtitle || "Kuwait's premier travel, tourism, and manpower group — delivering luxury experiences across the Gulf and beyond for over 45 years."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent("Hello, I would like to inquire about your services")}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Book via WhatsApp
            </a>
            <a href={`tel:${phoneDisplay}`} className="btn-ghost-gold gap-2">
              <Phone className="h-4 w-4" />
              {phoneDisplay}
            </a>
          </div>
          <div className="mt-3">
            <Link
              href="/"
              className="text-sm underline hover:text-gold-400"
              style={{ color: "var(--page-text-dim)" }}
            >
              عرض الموقع بالعربية →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s: { value: string; label: string }) => (
            <div
              key={s.label}
              className="rounded-2xl border p-6 text-center"
              style={{
                background: "var(--page-surface)",
                borderColor: "rgba(201,162,39,0.22)",
              }}
            >
              <p className="text-3xl font-black text-gold-gradient">{s.value}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">{cms?.servicesTagline || "OUR SERVICES"}</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
            {cms?.servicesTitle || "What We Offer"}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s: any) => {
            const Icon = s.icon || Plane;
            return (
              <Link key={s.title} href={s.href || "#"}
                className="group gold-glow-card rounded-3xl border p-6 transition"
                style={{
                  background: "var(--page-surface)",
                  borderColor: "rgba(201,162,39,0.18)",
                }}
              >
                <div className="mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                  {typeof s.icon === "string" ? <span className="h-6 w-6 flex items-center justify-center font-bold">{s.icon}</span> : <Icon className="h-6 w-6" />}
                </div>
                <h3 className="font-bold transition-colors group-hover:text-gold-300" style={{ color: "var(--page-text)" }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  {s.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.35em] text-gold-400">{cms?.whyUsTagline || "WHY GOLDEN AL'QADI"}</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
                {cms?.whyUsTitle || "45 Years of Trust"}
              </h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {cms?.whyUsText || "Founded in 1980, Golden Al'Qadi Group has grown to become Kuwait's most trusted travel and manpower company, serving over 860,000 clients across the Gulf region."}
              </p>
              <ul className="mt-6 space-y-3">
                {(cms?.whyUsFeatures || [
                  "ISO 9001 Certified Quality Management",
                  "24/7 Customer Support via WhatsApp",
                  "Best Price Guarantee on all bookings",
                  "Dedicated account managers for corporates",
                ]).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-gold-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(cms?.whyUsGrid || [
                { icon: "★", label: "4.9 / 5.0 Rating" },
                { icon: "🌍", label: "75+ Countries" },
                { icon: "👥", label: "10K+ Corporate Clients" },
                { icon: "✓", label: "ISO Certified" },
              ]).map((item: any) => (
                <div
                  key={item.label}
                  className="rounded-2xl border p-5 text-center"
                  style={{
                    background: "var(--page-surface)",
                    borderColor: "rgba(201,162,39,0.16)",
                  }}
                >
                  <div className="mx-auto mb-3 h-7 w-7 text-gold-400 flex items-center justify-center text-xl font-bold">{item.icon}</div>
                  <p className="text-sm font-medium" style={{ color: "var(--page-text)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-3xl border p-10" style={{ borderColor: "rgba(201,162,39,0.25)", background: "linear-gradient(90deg, rgba(201,162,39,0.12) 0%, transparent 70%)" }}>
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
            {cms?.ctaTitle || "Ready to Plan Your Journey?"}
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            {cms?.ctaSubtitle || "Contact our team and get personalized travel solutions within minutes."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent("Hello, I need travel assistance")}`}
              target="_blank" rel="noopener noreferrer" className="btn-gold gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link href="/services/travel" className="btn-ghost-gold gap-2">
              <Plane className="h-4 w-4" />
              Explore Travel Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
