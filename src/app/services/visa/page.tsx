"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  Search,
  BadgeCheck,
  Globe2,
  Phone,
  MessageCircle,
  ChevronLeft,
  Zap,
  Timer,
  Calendar,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

interface VisaType {
  label: string;
  duration: string;
  color: string;
  bg: string;
}

interface VisaCountry {
  id: string;
  country: string;
  flag: string;
  types: VisaType[];
}
const steps = [
  { icon: FileText, title: "أرسل طلبك", desc: "أرسل بياناتك ومعلومات سفرك عبر النموذج أو واتساب" },
  { icon: Upload, title: "أرفق المستندات", desc: "جواز السفر، الصور، الوثائق الداعمة — نرشدك لكل ما تحتاجه" },
  { icon: Search, title: "المراجعة والمعالجة", desc: "يراجع فريقنا الملف ويتولى كامل إجراءات التقديم" },
  { icon: BadgeCheck, title: "استلم التأشيرة", desc: "تُسلَّم التأشيرة إليكم إلكترونياً أو مطبوعة في الوقت المحدد" },
];

const features = [
  { icon: Shield, text: "متابعة مستمرة للطلب" },
  { icon: Clock, text: "معالجة سريعة وموثوقة" },
  { icon: Globe2, text: "تغطية +30 دولة" },
  { icon: CheckCircle2, text: "خبرة 45+ سنة" },
  { icon: Zap, text: "دعم فني متواصل" },
  { icon: Timer, text: "إشعارات فورية بحالة الطلب" },
];

export default function VisaPage() {
  const [visaCountries, setVisaCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visas")
      .then(res => res.json())
      .then(data => {
        setVisaCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load visas:", err);
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
          <p className="text-xs tracking-[0.4em] text-gold-400">VISA SERVICES</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            خدمات <span className="text-gold-gradient">التأشيرات من القاضي</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            نقدم في مجموعة القاضي الذهبية دعماً متكاملاً في متابعة عملية الحصول على التأشيرة لأكثر من 30 دولة حول العالم، بخبرة تمتد
            لأكثر من 45 عاماً.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن التأشيرات"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              استفسر عبر واتساب
            </a>
            <a href="tel:+96598765432" className="btn-ghost-gold gap-2">
              <Phone className="h-4 w-4" />
              اتصل بنا الآن
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gold-500/15 p-4 text-center"
              style={{ background: "var(--page-surface)" }}
            >
              <f.icon className="h-5 w-5 text-gold-400" />
              <p className="text-xs" style={{ color: "var(--page-text-muted)" }}>
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visa Countries */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <motion.div {...reveal} className="mb-12 text-center">
          <p className="text-xs tracking-[0.35em] text-gold-400">DESTINATIONS</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
            التأشيرات المتاحة عبر مجموعة القاضي
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            اختر وجهتك واطلب تأشيرتك بسهولة عبر فريق القاضي
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center py-10 text-gold-400">جاري تحميل التأشيرات...</div>
          ) : (
            visaCountries.map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="gold-glow-card rounded-3xl border border-gold-500/15 p-6"
                style={{ background: "var(--page-surface)" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <h3 className="text-xl font-bold" style={{ color: "var(--page-text)" }}>
                    {country.country}
                  </h3>
                </div>
                <div className="space-y-3">
                  {country.types.map((type) => (
                    <div
                      key={type.label}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${type.bg}`}
                    >
                      <span className={`text-sm font-medium ${type.color}`}>{type.label}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--page-text-muted)" }}>
                        <Clock className="h-3 w-3" />
                        {type.duration}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://api.whatsapp.com/send?phone=96598765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 py-2.5 text-sm text-gold-300 transition hover:bg-gold-500/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  قدّم طلبك الآن
                </a>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Steps */}
      <section className="py-20" style={{ background: "var(--section-alt-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <motion.div {...reveal} className="mb-14 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">HOW IT WORKS</p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
              كيف تحصل على تأشيرتك؟
            </h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent md:block" />
                )}
                <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
                  <step.icon className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-black">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold" style={{ color: "var(--page-text)" }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:px-10">
        <motion.div
          {...reveal}
          className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-10"
        >
          <Calendar className="mx-auto mb-4 h-10 w-10 text-gold-400" />
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
            فريق مجموعة القاضي جاهز لمساعدتك الآن
          </h2>
          <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
            تواصل معنا عبر واتساب للحصول على رد فوري وخدمة شخصية من مستشاري مجموعة القاضي.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=96598765432&text=مرحباً، أود الاستفسار عن خدمات التأشيرات"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل عبر واتساب
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
