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
  HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Plane,
  Compass,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  HeartHandshake,
  Ticket,
  WalletCards,
  Award,
  Star,
  Globe2,
  Sparkles,
};

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
};

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

type PackagePayload = { title: string; isHot?: boolean; nights?: number | string; includes?: string };
type HomeService = { title: string; desc: string; icon?: any };
type HomeOffer = { title: string; discount: string; body: string; icon?: any };
type HomeUpdate = { title: string; time: string; tag: string };
type HomeCms = Record<string, unknown>;

function HomeInner() {
  const [pkgs, setPkgs] = useState<HomeOffer[]>([]);
  const [_services, setServices] = useState<HomeService[]>([]);
  const [_updates, setUpdates] = useState<HomeUpdate[]>([]);
  const [homeCms, setHomeCms] = useState<HomeCms | null>(null);
  const [company, setCompany] = useState<Record<string, string> | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setHomeCms(data.cms_home || null);
        setCompany(data.company || null);

        if (Array.isArray(data.packages) && data.packages.length > 0) {
          const mappedPkgs = (data.packages as PackagePayload[]).map((p) => ({
            title: p.title,
            discount: p.isHot ? "VIP" : "متاح",
            icon: Ticket,
            body: `${p.nights || ""} - ${p.includes || ""}`,
          }));
          if (mappedPkgs.length > 0) setPkgs(mappedPkgs.slice(0, 3));
        }
        if (Array.isArray(data.cms_home?.offers)) {
          const mappedOffers = (data.cms_home.offers as any[]).map((o, idx) => ({
            ...o,
            icon: ICON_MAP[o.icon] || offers[idx % offers.length]?.icon || Ticket
          }));
          setPkgs(mappedOffers);
        }
        // CMS overrides for services/updates
        if (Array.isArray(data.cms_home?.services)) {
          const mappedServices = (data.cms_home.services as any[]).map((s, idx) => ({
            ...s,
            icon: ICON_MAP[s.icon] || services[idx % services.length]?.icon || Plane
          }));
          setServices(mappedServices);
        }
        if (Array.isArray(data.cms_home?.updates)) setUpdates(data.cms_home.updates as HomeUpdate[]);
      })
      .catch((err) => console.error("Failed to fetch home content", err));
  }, []);

  const home = homeCms || {};
  const displayServices = _services.length > 0 ? _services : services;
  const displayOffers = pkgs.length > 0 ? pkgs : offers;
  const displayUpdates = _updates.length > 0 ? _updates : updates;
  const text = (key: string, fallback: string) =>
    typeof home[key] === "string" ? (home[key] as string) : fallback;

  const handleSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setNewsletterSubscribed(true);
    setNewsletterLoading(false);
  };

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
              {text("welcomeTitlePrefix", "مرحباً بكم في")}{" "}
              <span className="text-gold-gradient">{text("welcomeTitleHighlight", company?.nameAr || "مجموعة القاضي الذهبية")}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed md:text-xl" style={{ color: "var(--page-text-muted)" }}>
              {text("welcomeBody", "نحن في مجموعة القاضي للسفريات والسياحة وخدمات الأيادي العاملة نضع بين أيديكم أكثر من أربعة عقود من التميز والخبرة.")}
            </p>
          </motion.div>

          <motion.div
            {...reveal}
            className="grid gap-8 overflow-hidden rounded-3xl border border-gold-500/20 p-5 backdrop-blur-xl md:grid-cols-2 md:p-8"
            style={{ background: "var(--page-surface)" }}
          >
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-gold-500/25">
              <Image src={text("inspirationImage1", "/assets/inspiration-cabin-1-v3.png")} alt={text("inspirationImage1Alt", "رفاهية السفر مع مجموعة القاضي")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-gold-500/25">
              <Image src={text("inspirationImage2", "/assets/inspiration-cabin-2-v4.png")} alt={text("inspirationImage2Alt", "الامتياز الذهبي لمجموعة القاضي")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
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
              <p className="text-xs tracking-[0.35em] text-gold-400">{text("servicesEyebrow", "SIGNATURE SERVICES")}</p>
              <h2 className="mt-4 text-3xl font-black text-gold-gradient md:text-5xl">{text("servicesTitle", "خدمات مجموعة القاضي المتكاملة")}</h2>
              <p className="mx-auto mt-4 max-w-2xl" style={{ color: "var(--page-text-muted)" }}>
                {text("servicesSubtitle", "توفر مجموعة القاضي الذهبية تجربة تفاعلية سريعة، ذكية، ومصممة لتبدو فاخرة على كل المستويات.")}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayServices.map((s, idx: number) => (
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
                    {(() => {
                      const ServiceIcon = s.icon || Plane;
                      return <ServiceIcon className="h-6 w-6" />;
                    })()}
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
                  {text("offersTitle", "عروض مجموعة القاضي الحصرية")}
                </h2>
              </div>
              <Link href={text("offersLink", "/services/travel")} className="btn-ghost-gold text-xs">{text("offersLinkLabel", "كل العروض")}</Link>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-3">
              {displayOffers.map((offer, idx) => (
                (() => {
                  const OfferIcon = offer.icon || Ticket;
                  return (
                <motion.article
                  key={offer.title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="gold-glow-card rounded-2xl p-6"
                  style={{ background: "var(--page-surface)" }}
                >
                  <OfferIcon className="h-6 w-6 text-gold-400" />
                  <p className="mt-3 inline-flex rounded-full bg-gold-500/15 px-3 py-1 text-xs text-gold-300">{offer.discount}</p>
                  <h3 className="mt-4 text-lg font-bold" style={{ color: "var(--page-text)" }}>
                    {offer.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
                    {offer.body}
                  </p>
                </motion.article>
                  );
                })()
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div {...reveal}>
              <h2 className="text-3xl font-bold md:text-5xl" style={{ color: "var(--page-text)" }}>
                {text("whyTitle", "لماذا تختار مجموعة القاضي؟")}
              </h2>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {text("whyDesc", "نحوّل تجربة السفر إلى قصة متكاملة: تخطيط، حجز، خدمة، متابعة.")}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-5 text-sm" style={{ color: "var(--page-text-muted)" }}>
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-gold-400" /> دعم 24/7</p>
                <p className="flex items-center gap-2"><Star className="h-4 w-4 text-gold-400" /> تقييمات ممتازة</p>
                <p className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-gold-400" /> شبكة وجهات واسعة</p>
                <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold-400" /> تجربة رقمية متطورة</p>
              </div>
            </motion.div>
            <motion.div {...reveal} className="relative min-h-[380px] overflow-hidden rounded-3xl border border-gold-500/20">
              <Image src={text("whyImage", "/assets/travel_luxury_asset_v3.png")} alt={text("whyImageAlt", "تجربة سفر فاخرة")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
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
                {text("tourismTitle", "السياحة الراقية مع مجموعة القاضي")}
              </h3>
              <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
                {text("tourismDesc", "نقدم في مجموعة القاضي الذهبية برامج فردية وعائلية مع تنقلات خاصة، إرشاد سياحي محترف، وترشيحات ذكية بناء على أسلوب سفرك الفاخر.")}
              </p>
              <div className="mt-6">
                <Link href={text("tourismLink", "/services/travel")} className="btn-gold text-xs">{text("tourismLinkLabel", "ابدأ برنامجك الآن")}</Link>
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-full">
              <Image src={text("tourismImage", "/assets/tourism_luxury_v3.png")} alt={text("tourismImageAlt", "سياحة فاخرة")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
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
              <Image src={text("manpowerImage", "/assets/manpower_luxury_v2.png")} alt={text("manpowerImageAlt", "أيدي عاملة محترفة")} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="order-1 p-8 md:order-2 md:p-10">
              <h3 className="text-2xl font-bold" style={{ color: "var(--page-text)" }}>
                {text("manpowerTitle", "كوادر القاضي للأيادي العاملة")}
              </h3>
              <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
                {text("manpowerDesc", "توفر مجموعة القاضي أفضل خدمات ترشيح وتصفية ومتابعة الأيادي العاملة، مع شفافية كاملة في الإجراءات والوثائق واهتمام إنساني عالٍ.")}
              </p>
              <div className="mt-6">
                <Link href={text("manpowerLink", "/services/manpower")} className="btn-ghost-gold text-xs">{text("manpowerLinkLabel", "اطلب الخدمة")}</Link>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="news" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <motion.div {...reveal} className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold" style={{ color: "var(--page-text)" }}>
              {text("newsTitle", "آخر الأخبار")}
            </h2>
            <Link href={text("newsLink", "/blog")} className="text-sm text-gold-400 hover:text-gold-300">{text("newsLinkLabel", "كل المقالات")}</Link>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {displayUpdates.map((item, idx: number) => (
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
              {text("bookingTitle", "احجز رحلتك أو خدمتك الآن مع مجموعة القاضي")}
            </h2>
            <p className="mt-3" style={{ color: "var(--page-text-muted)" }}>
              {text("bookingDesc", "رحلة تفاعلية من 3 خطوات، لضمان راحتك مع حفظ تلقائي للبيانات وسهولة متابعة الطلب مع خبراء مجموعة القاضي.")}
            </p>
            <div className="mt-8">
              <MultiStepLeadForm />
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
          <motion.div {...reveal} className="rounded-3xl border border-gold-500/20 bg-gradient-to-r from-gold-500/10 to-transparent p-12 text-center backdrop-blur-md">
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
              {text("newsletterTitle", "اشترك في النشرة الذهبية")}
            </h2>
            <p className="mt-4" style={{ color: "var(--page-text-muted)" }}>
              {text("newsletterDesc", "تنبيهات عروض، تحديثات رحلات، وفرص حصرية لأعضاء المجتمع.")}
            </p>
            {newsletterSubscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-bold">
                {text("newsletterSuccess", "تم الاشتراك بنجاح! شكراً لانضمامك إلينا.")}
              </motion.div>
            ) : (
              <div className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={text("newsletterPlaceholder", "أدخل بريدك الإلكتروني")}
                  className="form-input flex-1"
                  suppressHydrationWarning
                />
                <button 
                  onClick={handleSubscribe}
                  disabled={newsletterLoading}
                  className="btn-gold justify-center px-8 disabled:opacity-50" 
                  suppressHydrationWarning
                >
                  {newsletterLoading ? text("newsletterLoading", "جاري...") : (
                    <>
                      <Send className="h-4 w-4" />
                      {text("newsletterButton", "اشترك الآن")}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </section>


      </div>

      <ChatbotStub />
    </div>
  );
}

export function HomeExperience() {
  return <HomeInner />;
}
