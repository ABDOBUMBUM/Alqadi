"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  Star,
  Globe2,
  BadgeCheck,
  Award,
  Building2,
  MessageCircle,
  ChevronLeft,
  Quote,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const stats = [
  { value: "860,000+", label: "عميل سعيد", icon: Users },
  { value: "45+", label: "سنة خبرة", icon: Star },
  { value: "75+", label: "دولة حول العالم", icon: Globe2 },
  { value: "ISO 9001", label: "شهادة الجودة", icon: BadgeCheck },
];

const clients = [
  { name: "شركة أرامكو السعودية", sector: "طاقة", trips: "500+ رحلة سنوياً" },
  { name: "مجموعة زين للاتصالات", sector: "اتصالات", trips: "300+ رحلة سنوياً" },
  { name: "بنك الكويت الوطني", sector: "مالي", trips: "450+ رحلة سنوياً" },
  { name: "مجموعة الخليج للتأمين", sector: "تأمين", trips: "200+ رحلة سنوياً" },
  { name: "مؤسسة الكويت للتقدم العلمي", sector: "تعليم", trips: "150+ رحلة سنوياً" },
  { name: "شركة أجيليتي اللوجستية", sector: "لوجستيات", trips: "600+ رحلة سنوياً" },
  { name: "مجموعة دار الأركان", sector: "عقارات", trips: "180+ رحلة سنوياً" },
  { name: "مستشفى الملك فيصل التخصصي", sector: "صحة", trips: "250+ رحلة سنوياً" },
];

const testimonials = [
  {
    name: "أحمد الرشيد",
    role: "مدير السفريات — أرامكو السعودية",
    text: "تعاملنا مع مجموعة القاضي لأكثر من 12 سنة. مستوى الخدمة والاحترافية لا يضاهى. دائماً يفوق توقعاتنا.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    stars: 5,
  },
  {
    name: "فاطمة العجمي",
    role: "مسؤولة الموارد البشرية — بنك الكويت الوطني",
    text: "الحل المتكامل الذي يقدمونه للشركات يوفر وقتاً ومالاً وجهداً. التعامل مع فريقهم دائماً ممتع.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    stars: 5,
  },
  {
    name: "محمد البلوشي",
    role: "مدير عام — مجموعة الخليج",
    text: "سواء رحلات العمل أو البرامج السياحية للموظفين، دائماً ينجزون المهمة بأعلى مستويات الجودة.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    stars: 5,
  },
];

const whyUs = [
  { icon: BadgeCheck, title: "موثوقية عالية", desc: "خبرة 45 عاماً في السوق الكويتي والإقليمي" },
  { icon: Users, title: "دعم متواصل 24/7", desc: "فريق متخصص لخدمة الشركات على مدار الساعة" },
  { icon: Award, title: "معايير ISO 9001", desc: "جودة معتمدة دولياً في كل خدماتنا" },
  { icon: Globe2, title: "شبكة عالمية", desc: "شراكات استراتيجية في أكثر من 75 دولة" },
];

export default function ClientsPage() {
  const [_stats, setStats] = useState(stats);
  const [_clients, setClients] = useState(clients);
  const [_testimonials, setTestimonials] = useState(testimonials);
  const [_whyUs, setWhyUs] = useState(whyUs);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(data => {
      if (data.cms_clients?.stats) setStats(data.cms_clients.stats);
      if (data.cms_clients?.clients) setClients(data.cms_clients.clients);
      if (data.cms_clients?.testimonials) setTestimonials(data.cms_clients.testimonials);
      if (data.cms_clients?.whyUs) setWhyUs(data.cms_clients.whyUs);
    }).catch(() => {});
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
          <p className="text-xs tracking-[0.4em] text-gold-400">OUR CLIENTS</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            شركاء <span className="text-gold-gradient">النجاح</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            نفخر بثقة أكثر من 860,000 عميل — من كبرى الشركات والمؤسسات في الكويت والمنطقة — منذ عام 1980.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {_stats.map((stat: any, i: number) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-gold-500/20 p-6 text-center"
              style={{ background: "var(--page-surface)" }}
            >
              <Users className="mx-auto mb-3 h-7 w-7 text-gold-400" />
              <p className="text-3xl font-black text-gold-gradient">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <motion.div {...reveal} className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">WHY US</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
            لماذا يختاروننا؟
          </h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {_whyUs.map((item: any, i: number) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="feature-card text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold" style={{ color: "var(--page-text)" }}>
                {item.title}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Client Logos / List */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...reveal} className="mb-12 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">ENTERPRISE CLIENTS</p>
            <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              كبار عملائنا المؤسسيين
            </h2>
            <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
              شركات رائدة تثق في خدماتنا لإدارة سفر موظفيها
            </p>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {_clients.map((client: any, i: number) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 rounded-2xl border border-gold-500/15 p-4"
                style={{ background: "var(--page-surface)" }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/10">
                  <Building2 className="h-5 w-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--page-text)" }}>
                    {client.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gold-400">{client.sector}</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--page-text-dim)" }}>
                    {client.trips}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <motion.div {...reveal} className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">TESTIMONIALS</p>
          <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
            ماذا يقول عملاؤنا؟
          </h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {_testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="gold-glow-card rounded-3xl border border-gold-500/15 p-6"
              style={{ background: "var(--page-surface)" }}
            >
              <Quote className="mb-4 h-6 w-6 text-gold-500/40" />
              <p className="text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                &quot;{t.text}&quot;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t pt-5" style={{ borderColor: "var(--page-border-subtle)" }}>
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gold-500/30">
                  <Image src={t.img} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--page-text)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-gold-400">{t.role}</p>
                </div>
                <div className="mr-auto flex">
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <Star key={idx} className="h-3 w-3 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          {...reveal}
          className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-10"
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl">انضم إلى عائلة القاضي</h2>
          <p className="mt-3 text-white/55">
            تواصل معنا لمناقشة احتياجات شركتك ونضع لك حلاً مخصصاً لإدارة سفر موظفيك.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن خدمات الشركات"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل معنا
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
