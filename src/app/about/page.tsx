import type { Metadata } from "next";
import { getCmsData } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  Globe2, Users, BadgeCheck, Star, Award, Building2,
  Plane, Hotel, Briefcase, ShieldCheck, MessageCircle,
  Phone, MapPin, Clock, Target, Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن | مجموعة القاضي الذهبية للسفريات والسياحة",
  description:
    "تعرّف على مجموعة القاضي الذهبية — أكثر من 45 عاماً من التميز في خدمات السفريات والسياحة والأيادي العاملة، نخدم أكثر من 860,000 عميل في 75+ دولة.",
};

const milestones = [
  { year: "1980", title: "التأسيس", desc: "تأسيس مجموعة القاضي الذهبية للسفريات والسياحة في الكويت كمكتب صغير بطموح كبير." },
  { year: "1992", title: "التوسع الإقليمي", desc: "فتح فروع جديدة في اليمن — عدن وصنعاء — لتوسيع نطاق الخدمة إلى منطقة الخليج الأوسع." },
  { year: "2005", title: "خدمات الأيادي العاملة", desc: "إطلاق قسم الأيادي العاملة لتوظيف الكفاءات من مختلف الجنسيات والتخصصات." },
  { year: "2015", title: "شهادة ISO 9001", desc: "الحصول على شهادة الجودة العالمية ISO 9001 لتكون من أوائل شركات السفر المعتمدة." },
  { year: "2020", title: "التحول الرقمي", desc: "إطلاق المنصة الرقمية الشاملة لحجوزات الطيران والفنادق والتأشيرات إلكترونياً." },
  { year: "2025", title: "860,000 عميل", desc: "تجاوز 860,000 عميل سعيد مع شبكة شراكات في أكثر من 75 دولة حول العالم." },
];

const values = [
  { icon: ShieldCheck, title: "الموثوقية", desc: "نلتزم بأعلى معايير الجودة والشفافية في كل خدماتنا." },
  { icon: Star, title: "التميّز", desc: "نسعى لتقديم تجربة استثنائية تفوق توقعات عملائنا." },
  { icon: Users, title: "العميل أولاً", desc: "نضع رضا العميل في صميم كل قراراتنا التشغيلية." },
  { icon: Globe2, title: "الانتشار العالمي", desc: "شبكة شراكات استراتيجية في 75+ دولة تضمن أفضل الخدمات." },
];

/* Map CMS icon-name strings → actual Lucide components */
const iconMap: Record<string, any> = {
  Plane, Hotel, Globe2, Briefcase, ShieldCheck, Star, Users, Award,
  Building2, MessageCircle, Phone, MapPin, Clock, Target, Eye, BadgeCheck,
  plane: Plane, hotel: Hotel, visa: Globe2, manpower: Briefcase,
};
function resolveIcon(icon: any, fallback: any = Globe2) {
  if (typeof icon === "function") return icon;          // already a component
  if (typeof icon === "string") return iconMap[icon] ?? fallback;
  return fallback;
}

const services = [
  { icon: Plane, title: "السفريات والسياحة", desc: "حجوزات طيران وبرامج سياحية مخصصة لأكثر من 150 وجهة عالمية.", href: "/services/travel" },
  { icon: Hotel, title: "حجوزات الفنادق", desc: "فنادق 4 و5 نجوم بأسعار حصرية مع ضمان أفضل سعر.", href: "/services/hotels" },
  { icon: Globe2, title: "خدمات التأشيرات", desc: "معالجة سريعة وموثوقة للتأشيرات لأكثر من 30 دولة.", href: "/services/visa" },
  { icon: Briefcase, title: "الأيادي العاملة", desc: "توظيف الكفاءات من مختلف التخصصات للشركات في الخليج.", href: "/services/manpower" },
];

const stats = [
  { value: "860,000+", label: "عميل سعيد" },
  { value: "45+", label: "سنة خبرة" },
  { value: "75+", label: "دولة حول العالم" },
  { value: "5", label: "فروع نشطة" },
  { value: "ISO 9001", label: "شهادة الجودة" },
  { value: "98%", label: "نسبة الرضا" },
];

export default async function AboutPage() {
  const cms = await getCmsData("cms_about");
  const companySetting = await prisma.siteSetting.findUnique({ where: { key: "company" } });
  const branchesDb = await prisma.branch.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
  const company = (companySetting?.value as any) || {};
  const waPhone = String(company.whatsapp || "96598765432");
  const phone = String(company.phone || "+96598765432");
  const _heroTitle = cms?.heroTitle ?? company.nameAr ?? "";
  const _heroDesc = cms?.heroDesc ?? "";
  const _services = Array.isArray(cms?.services) ? cms.services : services;
  const _milestones = Array.isArray(cms?.milestones) ? cms.milestones : milestones;
  const _values = Array.isArray(cms?.values) ? cms.values : values;
  const _stats = Array.isArray(cms?.stats)
    ? cms.stats
    : [
        { value: company.clients ?? "", label: "العملاء" },
        { value: company.experience ?? "", label: "سنوات الخبرة" },
        { value: company.countries ?? "", label: "الدول" },
      ];
  const _vision = cms?.vision ?? "";
  const _mission = cms?.mission ?? "";
  const _branches = branchesDb.length > 0
    ? branchesDb.map((b) => ({ name: b.name, location: b.address || b.city, hours: "8:00 ص - 6:00 م" }))
    : (cms?.branches ?? []);
  return (
    <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,162,39,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-xs tracking-[0.4em] text-gold-400">ABOUT US — من نحن</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            {_heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            {_heroDesc}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {_stats.map((stat: any) => (
            <div
              key={stat.label}
              className="rounded-2xl border p-5 text-center"
              style={{
                background: "var(--page-surface)",
                borderColor: "rgba(201,162,39,0.20)",
              }}
            >
              <p className="text-2xl font-black text-gold-gradient">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-gold-500/20 p-8" style={{ background: "var(--page-surface)" }}>
              <div className="mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>{cms?.visionTitle || "رؤيتنا"}</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {_vision}
              </p>
            </div>
            <div className="rounded-3xl border border-gold-500/20 p-8" style={{ background: "var(--page-surface)" }}>
              <div className="mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>{cms?.missionTitle || "مهمتنا"}</h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {_mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">OUR VALUES</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
            {cms?.valuesTitle || "قيمنا الأساسية"}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {_values.map((item: any) => (
            <div
              key={item.title}
              className="rounded-3xl border p-6 text-center transition hover:border-gold-500/30"
              style={{
                background: "var(--page-surface)",
                borderColor: "rgba(201,162,39,0.15)",
              }}
            >
              {(() => { const Icon = resolveIcon(item.icon, ShieldCheck); return (
              <div className="mx-auto mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                <Icon className="h-6 w-6" />
              </div>
              ); })()}
              <h3 className="font-bold" style={{ color: "var(--page-text)" }}>{item.title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">OUR JOURNEY</p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
              {cms?.milestonesTitle || "مسيرتنا عبر السنوات"}
            </h2>
          </div>
          <div className="relative space-y-8">
            {/* Vertical line */}
            <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/50 via-gold-500/20 to-transparent md:right-1/2" />
            {_milestones.map((m: any, i: number) => (
              <div key={m.year} className="relative flex items-start gap-6 md:gap-0">
                {/* Dot */}
                <div className="absolute right-[18px] top-1 z-10 h-5 w-5 rounded-full border-2 border-gold-500 bg-gold-500/20 md:right-[calc(50%-10px)]" />
                <div className={`w-full pr-14 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-left" : "md:mr-auto md:pr-0 md:pl-12"}`}>
                  <div
                    className="rounded-2xl border border-gold-500/15 p-5"
                    style={{ background: "var(--page-surface)" }}
                  >
                    <span className="text-xs font-bold text-gold-400">{m.year}</span>
                    <h3 className="mt-1 font-bold" style={{ color: "var(--page-text)" }}>{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">OUR SERVICES</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
            {cms?.servicesTitle || "خدماتنا المتميزة"}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {_services.map((s: any) => (
            <Link
              key={s.title}
              href={s.href}
              className="group gold-glow-card rounded-3xl border p-6 transition"
              style={{
                background: "var(--page-surface)",
                borderColor: "rgba(201,162,39,0.18)",
              }}
            >
              {(() => { const Icon = resolveIcon(s.icon, Globe2); return (
              <div className="mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                <Icon className="h-6 w-6" />
              </div>
              ); })()}
              <h3 className="font-bold transition-colors group-hover:text-gold-300" style={{ color: "var(--page-text)" }}>
                {s.title}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="py-16" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">OUR BRANCHES</p>
            <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              {cms?.branchesTitle || "فروعنا"}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {_branches.map((b: any) => (
              <div
                key={b.name}
                className="flex items-start gap-4 rounded-2xl border border-gold-500/15 p-5"
                style={{ background: "var(--page-surface)" }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/10">
                  <Building2 className="h-5 w-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold" style={{ color: "var(--page-text)" }}>{b.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    <MapPin className="h-3 w-3 text-gold-500/50" /> {b.location}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--page-text-dim, var(--page-text-muted))" }}>
                    <Clock className="h-3 w-3 text-gold-500/50" /> {b.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div
          className="rounded-3xl border p-10"
          style={{ borderColor: "rgba(201,162,39,0.25)", background: "linear-gradient(90deg, rgba(201,162,39,0.12) 0%, transparent 70%)" }}
        >
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
            {cms?.ctaTitle || "جاهز لبدء رحلتك معنا؟"}
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            {cms?.ctaDesc || "تواصل مع فريقنا واحصل على استشارة مجانية لرحلتك القادمة."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent("مرحباً، أود الاستفسار عن خدماتكم")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {cms?.ctaBtnWhatsapp || "تواصل عبر واتساب"}
            </a>
            <a href={`tel:${phone}`} className="btn-ghost-gold gap-2">
              <Phone className="h-4 w-4" />
              {cms?.ctaBtnCall || "اتصل بنا"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
