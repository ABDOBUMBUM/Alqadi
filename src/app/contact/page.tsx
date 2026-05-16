"use client";

import Link from "next/link";
import {
  Phone, Mail, MapPin, MessageCircle, Clock,
  Building2, Send, Globe2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const branches = [
  { name: "الإدارة العامة", address: "الكويت — مجمع القاضي، شارع الخليج العربي", hours: "الأحد - الخميس: 8:00 ص - 5:00 م", phone: "+96598765432" },
  { name: "فرع صنعاء", address: "صنعاء — شارع الزبيري", hours: "السبت - الخميس: 8:00 ص - 6:00 م", phone: "+96712345678" },
  { name: "فرع عدن — السنافر", address: "عدن — المعلا", hours: "السبت - الخميس: 8:00 ص - 6:00 م", phone: "+96787654321" },
  { name: "فرع عدن — المنصورة (فلاي مي)", address: "عدن — المنصورة", hours: "السبت - الخميس: 8:00 ص - 6:00 م", phone: "+96787654322" },
  { name: "فرع عدن — خور مكسر", address: "عدن — خور مكسر", hours: "السبت - الخميس: 8:00 ص - 6:00 م", phone: "+96787654323" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [_branches, setBranches] = useState(branches);
  const [company, setCompany] = useState<any>({
    whatsapp: "96598765432",
    phone: "+96598765432",
    email: "info@alqadigroup.com",
    address: "الكويت — مجمع القاضي",
  });
  const [cmsContact, setCmsContact] = useState<any>({
    heroTitle: "تواصل معنا",
    heroDesc: "نحن هنا لمساعدتك. تواصل مع فريق مجموعة القاضي الذهبية عبر أي من القنوات التالية.",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.8!2d47.97!3d29.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIyJzQ4LjAiTiA0N8KwNTgnMTIuMCJF!5e0!3m2!1sar!2skw!4v1",
  });

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(data => {
      if (data.company) setCompany((prev: any) => ({ ...prev, ...data.company }));
      if (data.cms_contact) setCmsContact((prev: any) => ({ ...prev, ...data.cms_contact }));
      if (data.cms_contact?.branches) setBranches(data.cms_contact.branches);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service: subject, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.10) 0%, transparent 60%)" }}
        />
        <motion.div {...reveal} className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-xs tracking-[0.4em] text-gold-400">CONTACT US</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            {cmsContact.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            {cmsContact.heroDesc}
          </p>
        </motion.div>
      </section>

      {/* Quick Contact Cards */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MessageCircle,
              title: "واتساب",
              desc: "تواصل فوري على مدار الساعة",
              action: "ابدأ محادثة",
              href: `https://api.whatsapp.com/send?phone=${company.whatsapp}&text=${encodeURIComponent("مرحباً، أود الاستفسار")}`,
              color: "from-emerald-600/20 to-emerald-400/10 border-emerald-500/25",
              iconColor: "text-emerald-400",
            },
            {
              icon: Phone,
              title: "اتصل بنا",
              desc: company.phone || "+965 9876 5432",
              action: "اتصل الآن",
              href: `tel:${company.phone || "+96598765432"}`,
              color: "from-blue-600/20 to-blue-400/10 border-blue-500/25",
              iconColor: "text-blue-400",
            },
            {
              icon: Mail,
              title: "البريد الإلكتروني",
              desc: company.email || "info@alqadigroup.com",
              action: "أرسل رسالة",
              href: `mailto:${company.email || "info@alqadigroup.com"}`,
              color: "from-gold-600/20 to-gold-400/10 border-gold-500/25",
              iconColor: "text-gold-400",
            },
            {
              icon: MapPin,
              title: "زُرنا",
              desc: company.address || "الكويت — مجمع القاضي",
              action: "عرض الخريطة",
              href: "https://maps.google.com/?q=Kuwait+City",
              color: "from-purple-600/20 to-purple-400/10 border-purple-500/25",
              iconColor: "text-purple-400",
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`rounded-2xl border bg-gradient-to-br p-6 transition hover:scale-[1.02] ${card.color}`}
            >
              <card.icon className={`h-8 w-8 ${card.iconColor}`} />
              <h3 className="mt-4 font-bold text-white">{card.title}</h3>
              <p className="mt-1 text-sm text-white/60">{card.desc}</p>
              <p className={`mt-3 text-xs font-bold ${card.iconColor}`}>{card.action} →</p>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Form */}
          <motion.div {...reveal}>
            <div className="rounded-3xl border border-gold-500/15 p-8" style={{ background: "var(--page-surface)" }}>
              <h2 className="mb-6 text-xl font-bold" style={{ color: "var(--page-text)" }}>
                أرسل لنا رسالة
              </h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <Send className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-emerald-400">تم إرسال رسالتك بنجاح!</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    سنتواصل معك في أقرب وقت ممكن.
                  </p>
                  <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-gold-400 underline hover:text-gold-300">
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs" style={{ color: "var(--page-text-muted)" }}>الاسم الكامل *</label>
                      <input
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="محمد أحمد"
                        className="w-full rounded-xl border border-gold-500/20 px-4 py-3 text-sm outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                        style={{ background: "var(--page-bg)", color: "var(--page-text)" }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs" style={{ color: "var(--page-text-muted)" }}>البريد الإلكتروني *</label>
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full rounded-xl border border-gold-500/20 px-4 py-3 text-sm outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                        style={{ background: "var(--page-bg)", color: "var(--page-text)" }}
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs" style={{ color: "var(--page-text-muted)" }}>رقم الهاتف</label>
                      <input
                        type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="+965..."
                        className="w-full rounded-xl border border-gold-500/20 px-4 py-3 text-sm outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                        style={{ background: "var(--page-bg)", color: "var(--page-text)" }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs" style={{ color: "var(--page-text-muted)" }}>الموضوع</label>
                      <select
                        value={subject} onChange={(e) => setSubject(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gold-500/20 px-4 py-3 text-sm outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                        style={{ background: "var(--page-bg)", color: "var(--page-text)" }}
                        dir="rtl"
                      >
                        <option value="">اختر الموضوع...</option>
                        <option value="travel">حجز سفر / رحلة</option>
                        <option value="visa">استفسار تأشيرة</option>
                        <option value="hotel">حجز فندق</option>
                        <option value="manpower">توظيف / أيادي عاملة</option>
                        <option value="corporate">خدمات شركات</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs" style={{ color: "var(--page-text-muted)" }}>رسالتك</label>
                    <textarea
                      value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-gold-500/20 px-4 py-3 text-sm outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                      style={{ background: "var(--page-bg)", color: "var(--page-text)" }}
                      dir="rtl"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 py-3 text-sm font-bold text-black transition hover:from-gold-500 hover:to-gold-300 disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-center text-sm text-red-400">حدث خطأ. حاول مرة أخرى أو تواصل عبر واتساب.</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>

          {/* Map placeholder + Branches */}
          <motion.div {...reveal} className="space-y-6">
            {/* Map */}
            <div className="overflow-hidden rounded-3xl border border-gold-500/15" style={{ background: "var(--page-surface)" }}>
              <iframe
                src={cmsContact.mapEmbed}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع مجموعة القاضي الذهبية"
              />
            </div>

            {/* Branches list */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold" style={{ color: "var(--page-text)" }}>
                <Globe2 className="ml-2 inline h-4 w-4 text-gold-400" />
                فروعنا
              </h3>
              {_branches.map((b: any) => (
                <div
                  key={b.name}
                  className="flex items-start gap-3 rounded-2xl border border-gold-500/10 p-4"
                  style={{ background: "var(--page-surface)" }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/20">
                    <Building2 className="h-4 w-4 text-gold-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold" style={{ color: "var(--page-text)" }}>{b.name}</p>
                    <p className="mt-0.5 flex items-center gap-1" style={{ color: "var(--page-text-muted)" }}>
                      <MapPin className="h-3 w-3 text-gold-500/50" /> {b.address}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: "var(--page-text-dim, var(--page-text-muted))" }}>
                      <Clock className="h-3 w-3 text-gold-500/50" /> {b.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
