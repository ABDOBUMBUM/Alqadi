"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Hero3D } from "@/components/site/Hero3D";
import { AmbientAudio } from "@/components/ui/AmbientAudio";
import { ChatbotStub } from "@/components/chat/ChatbotStub";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";
import { HorizontalDestinations } from "@/components/site/HorizontalDestinations";
import { PackageConfigurator } from "@/components/site/PackageConfigurator";
import {
  Award,
  BriefcaseBusiness,
  Clock3,
  Compass,
  Globe2,
  HeartHandshake,
  Mail,
  MapPin,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  WalletCards,
} from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
};

const destinations = [
  { city: "لندن", country: "المملكة المتحدة", price: "210", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80" },
  { city: "اسطنبول", country: "تركيا", price: "145", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=700&q=80" },
  { city: "باريس", country: "فرنسا", price: "175", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80" },
  { city: "دبي", country: "الإمارات", price: "190", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80" },
];

const services = [
  { title: "حجوزات الطيران الفاخر", icon: Plane, desc: "أفضل المسارات والأسعار المرنة مع دعم VIP." },
  { title: "الكونسيرج السياحي", icon: Compass, desc: "رحلات مصممة حسب ذوقكم وخططكم." },
  { title: "تأشيرات وسفر أعمال", icon: BriefcaseBusiness, desc: "إدارة ملفات السفر للشركات والأفراد." },
  { title: "الأيادي العاملة", icon: Users, desc: "حلول توظيف موثوقة وفق معايير دقيقة." },
  { title: "حماية وتأمين السفر", icon: ShieldCheck, desc: "تغطيات ذكية واستجابة سريعة للطوارئ." },
  { title: "الاستقبال والمرافقة", icon: HeartHandshake, desc: "خدمة شخصية متكاملة من الباب للباب." },
];

const offers = [
  { title: "باقة أوروبا الملكية", discount: "خصم 22%", icon: Ticket, body: "تذاكر + فندق + تأمين شامل مع مرونة تغيير." },
  { title: "برنامج الصيف الذهبي", discount: "خصم 18%", icon: WalletCards, body: "أقساط مريحة وخيارات عائلية شاملة." },
  { title: "Business Elite", discount: "امتيازات VIP", icon: Award, body: "مسارات سريعة وصالات مطار وخدمة مدير رحلة." },
];

const updates = [
  { title: "إطلاق بوابة متابعة الطلبات", time: "منذ يومين", tag: "تطوير" },
  { title: "تحديث عروض تركيا وماليزيا", time: "منذ 4 أيام", tag: "عروض" },
  { title: "شراكات جديدة مع فنادق 5 نجوم", time: "منذ أسبوع", tag: "شراكات" },
];

import { PricingSection } from "@/components/site/PricingSection";

function HomeInner() {
  const [dests, setDests] = useState<any[]>(destinations);
  const [pkgs, setPkgs] = useState<any[]>(offers);
  const [_services, setServices] = useState<any[]>(services);
  const [_updates, setUpdates] = useState<any[]>(updates);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.destinations && data.destinations.length > 0) {
          const mappedDests = data.destinations
            .filter((d: any) => d.active)
            .map((d: any) => ({
              city: d.name.split("،")[0] || d.name,
              country: d.name.split("،")[1] || "",
              price: "عرض خاص",
              img: d.img,
            }));
          if (mappedDests.length > 0) setDests(mappedDests.slice(0, 4));
        }
        
        if (data.packages && data.packages.length > 0) {
          const mappedPkgs = data.packages.map((p: any) => ({
            title: p.title,
            discount: p.isHot ? "VIP" : "متاح",
            icon: Ticket,
            body: `${p.nights} - ${p.includes || ""}`,
          }));
          if (mappedPkgs.length > 0) setPkgs(mappedPkgs.slice(0, 3));
        }
        // CMS overrides for services/updates
        if (data.cms_home?.services) setServices(data.cms_home.services);
        if (data.cms_home?.updates) setUpdates(data.cms_home.updates);
      })
      .catch((err) => console.error("Failed to fetch home content", err));
  }, []);

  return (
    <div className="relative min-h-screen marble-bg" style={{ color: "var(--page-text)" }}>
      <AmbientAudio />

      <div id="home" className="relative z-10">
        <section id="story-travel" className="scroll-mt-24" aria-label="بداية القصة">
          <Hero3D />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
          <motion.div {...reveal} className="mb-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-black md:text-5xl" style={{ color: "var(--page-text)" }}>
              مرحباً بكم في <span className="text-gold-gradient">مجموعة القاضي الذهبية</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed md:text-xl" style={{ color: "var(--page-text-muted)" }}>
              نحن في <strong className="text-gold-400 font-bold">مجموعة القاضي للسفريات والسياحة وخدمات الأيادي العاملة</strong> نضع بين أيديكم أكثر من أربعة عقود من التميز والخبرة. نفخر بتقديم تجارب سفر استثنائية، برامج سياحية متكاملة حول العالم، وحلول احترافية لتوفير الكوادر البشرية، مع التزامنا التام بأعلى معايير الجودة والفخامة التي تليق بثقة عملائنا.
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="grid gap-8 overflow-hidden rounded-3xl border border-gold-500/20 p-5 backdrop-blur-xl md:grid-cols-2 md:p-8"
            style={{ background: "var(--page-surface)" }}
          >
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-gold-500/25">
              <Image src="/assets/inspiration-cabin-1-v3.png" alt="رفاهية السفر مع مجموعة القاضي" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-gold-500/25">
              <Image src="/assets/inspiration-cabin-2-v4.png" alt="الامتياز الذهبي لمجموعة القاضي" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </motion.div>
        </section>

        <section
          id="services"
          className="section-padding backdrop-blur-sm"
          style={{ background: "var(--section-alt-bg)" }}
        >
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <motion.div {...reveal} className="mb-14 text-center">
              <p className="text-xs tracking-[0.35em] text-gold-400">SIGNATURE SERVICES</p>
              <h2 className="mt-4 text-3xl font-black text-gold-gradient md:text-5xl">خدمات مجموعة القاضي المتكاملة</h2>
              <p className="mx-auto mt-4 max-w-2xl" style={{ color: "var(--page-text-muted)" }}>
                توفر مجموعة القاضي الذهبية تجربة تفاعلية سريعة، ذكية، ومصممة لتبدو فاخرة على كل المستويات.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {_services.map((s: any, idx: number) => (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="feature-card"
                >
                  <div className="mb-4 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-300">
                    <Plane className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--page-text)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    {s.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <HorizontalDestinations />

        <PricingSection />

        <section id="offers" className="py-24" style={{ background: "var(--section-alt-bg)" }}>
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <motion.div {...reveal} className="mb-12 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.35em] text-gold-400">LIMITED OFFERS</p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={{ color: "var(--page-text)" }}>
                  عروض مجموعة القاضي الحصرية
                </h2>
              </div>
              <Link href="/services/travel" className="btn-ghost-gold text-xs">كل العروض</Link>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-3">
              {pkgs.map((offer, idx) => (
                <motion.article
                  key={offer.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="gold-glow-card rounded-2xl p-6"
                  style={{ background: "var(--page-surface)" }}
                >
                  <offer.icon className="h-6 w-6 text-gold-400" />
                  <p className="mt-3 inline-flex rounded-full bg-gold-500/15 px-3 py-1 text-xs text-gold-300">{offer.discount}</p>
                  <h3 className="mt-4 text-lg font-bold" style={{ color: "var(--page-text)" }}>
                    {offer.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    {offer.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div {...reveal}>
              <h2 className="text-3xl font-bold md:text-5xl" style={{ color: "var(--page-text)" }}>
                لماذا تختار مجموعة القاضي؟
              </h2>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                نحوّل تجربة السفر إلى قصة متكاملة: تخطيط، حجز، خدمة، متابعة.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-5 text-sm" style={{ color: "var(--page-text-muted)" }}>
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-gold-400" /> دعم 24/7</p>
                <p className="flex items-center gap-2"><Star className="h-4 w-4 text-gold-400" /> تقييمات ممتازة</p>
                <p className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-gold-400" /> شبكة وجهات واسعة</p>
                <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold-400" /> تجربة رقمية متطورة</p>
              </div>
            </motion.div>
            <motion.div {...reveal} className="relative min-h-[380px] overflow-hidden rounded-3xl border border-gold-500/20">
              <Image src="/assets/travel_luxury_asset_v3.png" alt="تجربة سفر فاخرة" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>
          </div>
        </section>

        <section id="tourism" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <motion.div
            {...reveal}
            className="grid gap-10 overflow-hidden rounded-3xl border border-gold-500/25 md:grid-cols-2"
            style={{ background: "var(--page-surface)" }}
          >
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
                السياحة الراقية مع مجموعة القاضي
              </h3>
              <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
                نقدم في مجموعة القاضي الذهبية برامج فردية وعائلية مع تنقلات خاصة، إرشاد سياحي محترف، وترشيحات ذكية بناء على أسلوب سفرك الفاخر.
              </p>
              <div className="mt-6">
                <Link href="/services/travel" className="btn-gold text-xs">ابدأ برنامجك الآن</Link>
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-full">
              <Image src="/assets/tourism_luxury_v3.png" alt="سياحة فاخرة" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </motion.div>
        </section>

        <section id="manpower" className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <motion.div
            {...reveal}
            className="grid gap-10 overflow-hidden rounded-3xl border border-gold-500/25 md:grid-cols-2"
            style={{ background: "var(--page-surface)" }}
          >
            <div className="relative order-2 min-h-[240px] md:order-1 md:min-h-full">
              <Image src="/assets/manpower_luxury_v2.png" alt="أيدي عاملة محترفة" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="order-1 p-8 md:order-2 md:p-10">
              <h3 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
                كوادر القاضي للأيادي العاملة
              </h3>
              <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
                توفر مجموعة القاضي أفضل خدمات ترشيح وتصفية ومتابعة الأيادي العاملة، مع شفافية كاملة في الإجراءات والوثائق واهتمام إنساني عالٍ.
              </p>
              <div className="mt-6">
                <Link href="/services/manpower" className="btn-ghost-gold text-xs">اطلب الخدمة</Link>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="news" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div {...reveal} className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              آخر الأخبار
            </h2>
            <Link href="/blog" className="text-sm text-gold-400 hover:text-gold-300">كل المقالات</Link>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {_updates.map((item: any, idx: number) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }}
              >
                <p className="text-xs text-gold-400">{item.tag}</p>
                <h3 className="mt-2 font-semibold" style={{ color: "var(--page-text)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-xs" style={{ color: "var(--page-text-dim)" }}>
                  {item.time}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="booking" className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
          <motion.div {...reveal} className="mb-12">
            <PackageConfigurator />
          </motion.div>

          <motion.div {...reveal} className="rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-8 md:p-12">
            <h2 className="text-3xl font-black md:text-4xl" style={{ color: "var(--page-text)" }}>
              احجز رحلتك أو خدمتك الآن مع مجموعة القاضي
            </h2>
            <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
              رحلة تفاعلية من 3 خطوات، لضمان راحتك مع حفظ تلقائي للبيانات وسهولة متابعة الطلب مع خبراء مجموعة القاضي.
            </p>
            <div className="mt-8">
              <MultiStepLeadForm />
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
          <motion.div {...reveal} className="rounded-3xl border border-gold-500/20 bg-gradient-to-r from-gold-500/10 to-transparent p-12 text-center backdrop-blur-md">
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
              اشترك في النشرة الذهبية
            </h2>
            <p className="mt-4" style={{ color: "var(--page-text-muted)" }}>
              تنبيهات عروض، تحديثات رحلات، وفرص حصرية لأعضاء المجتمع.
            </p>
            <div className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="form-input flex-1"
                suppressHydrationWarning
              />
              <button className="btn-gold justify-center px-8" suppressHydrationWarning>
                <Send className="h-4 w-4" />
                اشترك الآن
              </button>
            </div>
          </motion.div>
        </section>

        <footer
          id="contact"
          className="border-t py-20 backdrop-blur-md"
          style={{ borderColor: "var(--page-border-subtle)", background: "var(--section-alt-bg)" }}
        >
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-12 md:grid-cols-4">
              <div>
                <Image
                  src="/brand/alqadi-logo.png"
                  alt="مجموعة القاضي الذهبية للسفريات والسياحة"
                  width={130}
                  height={56}
                  className="mb-6 h-auto w-auto"
                />
                <p className="text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                  مجموعة القاضي الذهبية للسفريات والسياحة وخدمة الأيادي العاملة. تميز في الخدمة وجودة في الأداء.
                </p>
              </div>
              <div>
                <h4 className="mb-6 text-lg font-bold" style={{ color: "var(--page-text)" }}>
                  روابط سريعة
                </h4>
                <ul className="space-y-4 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  <li><Link href="#services" className="hover:text-gold-400">خدماتنا</Link></li>
                  <li><Link href="/clients" className="hover:text-gold-400">عملاؤنا</Link></li>
                  <li><Link href="#offers" className="hover:text-gold-400">العروض</Link></li>
                  <li><Link href="#booking" className="hover:text-gold-400">الحجز</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-lg font-bold" style={{ color: "var(--page-text)" }}>
                  الخدمات
                </h4>
                <ul className="space-y-4 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  <li><Link href="/services/travel" className="hover:text-gold-400">سياحة وسفر</Link></li>
                  <li><Link href="/services/visa" className="hover:text-gold-400">التأشيرات</Link></li>
                  <li><Link href="/services/hotels" className="hover:text-gold-400">الفنادق الفاخرة</Link></li>
                  <li><Link href="/services/manpower" className="hover:text-gold-400">الأيادي العاملة</Link></li>
                  <li><Link href="/faq" className="hover:text-gold-400">الأسئلة الشائعة</Link></li>
                  <li><Link href="/vip" className="hover:text-gold-400">بوابة VIP</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-lg font-bold" style={{ color: "var(--page-text)" }}>
                  تواصل معنا
                </h4>
                <ul className="space-y-4 text-sm" style={{ color: "var(--page-text-muted)" }}>
                  <li className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-gold-400" /> +965 9876 5432</li>
                  <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold-400" /> info@alqadigroup.com</li>
                  <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-gold-400" /> الكويت - حولي - شارع بيروت برج القاضي - الدور 12</li>
                </ul>
              </div>
            </div>
            <div className="mt-20 border-t pt-8 text-center text-[11px]" style={{ borderColor: "var(--page-border-subtle)", color: "var(--page-text-dim)" }}>
              <p>جميع الحقوق محفوظة © 2026 مجموعة القاضي الذهبية للسفريات والسياحة | سياسة الخصوصية | الشروط والأحكام</p>
              <div className="mt-3 flex justify-center">
                <a
                  href="/admin"
                  title="لوحة التحكم"
                  className="flex h-7 w-7 items-center justify-center rounded-full border opacity-30 transition-all duration-300 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-400 hover:opacity-100"
                  style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)", color: "var(--page-text-dim)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <ChatbotStub />
    </div>
  );
}

export function HomeExperience() {
  return <HomeInner />;
}
