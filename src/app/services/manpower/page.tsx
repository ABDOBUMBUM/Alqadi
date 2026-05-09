"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jobs as staticJobs } from "./data";
import {
  Users, Briefcase, Globe2, ShieldCheck, Clock, BadgeCheck,
  ChevronLeft, MessageCircle, Phone, Building2, Star,
  MapPin, Calendar, DollarSign, ArrowLeft,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};



const categories = ["الكل", "هندسة", "صحة", "تقنية", "ضيافة وفنادق", "مالية ومحاسبة", "نقل ولوجستيات"];

const categoryColors: Record<string, string> = {
  "هندسة": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "صحة": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "تقنية": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "ضيافة وفنادق": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "مالية ومحاسبة": "text-gold-400 bg-gold-500/10 border-gold-500/20",
  "نقل ولوجستيات": "text-red-400 bg-red-500/10 border-red-500/20",
};

const stats = [
  { value: "1,200+", label: "وظيفة مُنجزة", icon: Briefcase },
  { value: "45+", label: "شركة شريكة", icon: Building2 },
  { value: "15+", label: "دولة عمل", icon: Globe2 },
  { value: "98%", label: "نسبة رضا", icon: Star },
];

const process = [
  { step: "01", title: "تقديم الطلب", desc: "أرسل سيرتك الذاتية عبر واتساب أو النموذج المباشر" },
  { step: "02", title: "المراجعة والتصفية", desc: "يراجع فريقنا ملفك ويتحقق من المؤهلات والخبرات" },
  { step: "03", title: "المطابقة مع الفرص", desc: "نطابق ملفك مع أفضل الفرص المتاحة في قاعدة بياناتنا" },
  { step: "04", title: "التوظيف والمتابعة", desc: "نتولى إجراءات التأشيرة والعقد ونتابع ما بعد التوظيف" },
];

export default function ManpowerPage() {
  const [apiJobs, setApiJobs] = useState<any[]>(staticJobs);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApiJobs(data);
        }
      })
      .catch(console.error);
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
          <p className="text-xs tracking-[0.4em] text-gold-400">MANPOWER SERVICES</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            خدمات <span className="text-gold-gradient">الأيادي العاملة من القاضي</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            نربط في مجموعة القاضي الذهبية أصحاب العمل بالكفاءات المؤهلة في جميع القطاعات، مع متابعة شاملة من التوظيف حتى ما بعد التعاقد لضمان أعلى معايير الجودة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن خدمات التوظيف"
              target="_blank" rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              أرسل سيرتك الذاتية
            </a>
            <a href="tel:+96598765432" className="btn-ghost-gold gap-2">
              <Phone className="h-4 w-4" />
              تواصل معنا
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-gold-500/20 p-6 text-center"
              style={{ background: "var(--page-surface)" }}
            >
              <s.icon className="mx-auto mb-3 h-7 w-7 text-gold-400" />
              <p className="text-3xl font-black text-gold-gradient">{s.value}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...reveal} className="mb-14 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">HOW IT WORKS</p>
            <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              كيف تعمل خدمة مجموعة القاضي للتوظيف؟
            </h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-4">
            {process.map((p, i) => (
              <motion.div key={p.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                {i < process.length - 1 && (
                  <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent md:block" />
                )}
                <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10">
                  <span className="text-sm font-black text-gold-400">{p.step}</span>
                </div>
                <h3 className="font-bold" style={{ color: "var(--page-text)" }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <motion.div {...reveal} className="mb-8">
          <p className="text-xs tracking-[0.35em] text-gold-400">OPEN POSITIONS</p>
          <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--page-text)" }}>
            الوظائف المتاحة الآن
          </h2>
          <p className="mt-2" style={{ color: "var(--page-text-muted)" }}>
            فرص عمل حقيقية في الكويت والخليج العربي
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                cat === "الكل"
                  ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
                  : "hover:border-gold-500/30 hover:text-gold-300"
              }`}
              style={cat === "الكل" ? undefined : { borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text-muted)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {apiJobs.map((job, i) => (
            <motion.article key={job.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="gold-glow-card group rounded-3xl border border-gold-500/15 p-6 transition hover:border-gold-500/30"
              style={{ background: "var(--page-surface)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${categoryColors[job.category] ?? "text-gold-400 bg-gold-500/10 border-gold-500/20"}`}>
                      {job.category}
                    </span>
                    {job.urgent && (
                      <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                        عاجل
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold group-hover:text-gold-300 transition-colors" style={{ color: "var(--page-text)" }}>
                    {job.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gold-400">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.company || "مجموعة القاضي للتوظيف"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs" style={{ color: "var(--page-text-muted)" }}>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gold-400/70" />{job.location || job.country}</span>
                <span className="flex items-center gap-1" dir="rtl"><DollarSign className="h-3 w-3 text-gold-400/70" /><span dir="ltr">{job.salary} {job.currency || "KWD"}</span></span>
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-gold-400/70" />{job.type || "دوام كامل"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-gold-400/70" />{job.posted || "متاح للتقديم"}</span>
              </div>

              <p className="mt-3 text-sm line-clamp-2" style={{ color: "var(--page-text-muted)" }}>
                {job.desc || job.description}
              </p>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/services/manpower/${job.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold-500/25 py-2 text-sm text-gold-300 transition hover:bg-gold-500/10"
                >
                  عرض التفاصيل <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود التقدم لوظيفة ${encodeURIComponent(job.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-gold-500/15 border border-gold-500/30 px-4 py-2 text-sm text-gold-300 transition hover:bg-gold-500/25"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  تقدّم الآن
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* For Companies */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div {...reveal}>
              <p className="text-xs tracking-[0.35em] text-gold-400">FOR EMPLOYERS</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
                أنت صاحب عمل؟ مجموعة القاضي هنا لخدمتك
              </h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                نساعدك في مجموعة القاضي في إيجاد الكفاءات المناسبة بسرعة وموثوقية. قدّم متطلباتك وسيتولى فريقنا الاستقطاب والتصفية الأولية بكل احترافية.
              </p>
              <ul className="mt-6 space-y-3">
                {["قاعدة بيانات 10,000+ مرشح مؤهل", "تصفية وفرز الملفات مسبقاً", "متابعة ما بعد التوظيف", "إجراءات التأشيرة والعقود"].map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    <BadgeCheck className="h-4 w-4 text-gold-400 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، نحن شركة ونرغب في التوظيف عبر مجموعة القاضي"
                target="_blank" rel="noopener noreferrer"
                className="btn-gold mt-8 inline-flex gap-2"
              >
                <Building2 className="h-4 w-4" />
                تواصل كصاحب عمل
              </a>
            </motion.div>
            <motion.div {...reveal} className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "استقطاب المواهب" },
                { icon: ShieldCheck, label: "فحص الخلفيات" },
                { icon: Globe2, label: "توظيف دولي" },
                { icon: Clock, label: "تسليم سريع" },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gold-500/15 p-5 text-center"
                  style={{ background: "var(--page-surface)" }}
                >
                  <item.icon className="mx-auto mb-3 h-7 w-7 text-gold-400" />
                  <p className="text-sm font-medium" style={{ color: "var(--page-text)" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div {...reveal} className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-10">
          <h2 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
            هل أنت جاهز للخطوة القادمة مع مجموعة القاضي؟
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            أرسل سيرتك الذاتية الآن وسيتواصل معك فريق توظيف مجموعة القاضي خلال 24 ساعة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود إرسال سيرتي الذاتية"
              target="_blank" rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              أرسل CV عبر واتساب
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
