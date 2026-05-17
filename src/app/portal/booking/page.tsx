"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Plane, Search, ShieldCheck, Ticket, Users, 
  PhoneCall, Globe, ArrowLeft, CheckCircle2, 
  ChevronLeft, BarChart3, Clock, Database, Navigation
} from "lucide-react";

// ========================================================
// ⚡ MEDIA & ASSET PIPELINE
// ========================================================
const HERO_VIDEO_URL = "/assets/Airplane_gliding_through_clouds_202605162225.mp4";
const RADAR_VIDEO_URL = "/assets/Radar_scanning_globe_interface_202605162208.mp4";
const LOGO_SVG = "/assets/AI-Image-Editor-2026-04-29_20-43-05-removebg-preview.png";

// ========================================================
// ⚡ COMPONENTS
// ========================================================

// 1. Magnetic Component
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < 120) {
      setPosition({ x: distanceX * 0.35, y: distanceY * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// 2. Boomerang Video Background
const BoomerangVideoBg = ({ src, className, isRadar = false }: { src: string, className?: string, isRadar?: boolean }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className || ''}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover ${isRadar ? 'opacity-30 mix-blend-screen scale-150' : 'opacity-50'}`}
        src={src}
      />
      {!isRadar && <div className="absolute inset-0 bg-[#0f172a]/75" />}
    </div>
  );
};

// 3. Workflow Scroll Text Reveal Component
const WorkflowText = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 0.8", "1 0.4"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="max-w-4xl mx-auto text-center mb-24">
      <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-slate-900 tracking-tight font-cairo">
        آلية العمل
      </h2>
      <p className="text-xl md:text-3xl font-medium leading-[1.6] md:leading-relaxed text-slate-600 font-cairo">
        نحن لا نبيع تذاكر فقط، نحن نبني تجربة <span className="text-[#8e6d3e] font-bold">سفر متكاملة</span> تمنح العميل راحة البال والثقة الكاملة.
      </p>
    </motion.div>
  );
};

// 4. Tile component for Marquees
const Tile = ({ icon: Icon }: { icon: React.ComponentType<any> }) => (
  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl liquid-glass flex items-center justify-center text-[#b08d57] hover:text-white hover:bg-[#b08d57] transition-colors duration-300">
    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
  </div>
);

// ========================================================
// ⚡ MAIN PORTAL PAGE Component
// ========================================================
export default function BookingPortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check NextAuth session just like dashboard/workspace pages do
    import("next-auth/react").then(({ getSession }) => {
      getSession().then(sessionData => {
        if (!sessionData?.user) {
          router.replace("/portal/login");
          return;
        }
        setLoading(false);
      });
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white font-cairo text-lg" dir="rtl">
        جاري التحقق من صلاحيات الدخول...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-cairo overflow-x-hidden" dir="rtl">
      
      {/* SECTION 1 — CINEMATIC HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden noise-overlay">
        <BoomerangVideoBg src={HERO_VIDEO_URL} />
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:px-8 md:py-6">
          <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={LOGO_SVG} 
                alt="AlQadi Gold Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white leading-tight">مجموعة القاضي</span>
                <span className="text-[#b08d57] text-xs font-semibold tracking-widest uppercase">الذهبية</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="/portal/dashboard" className="hover:text-[#b08d57] transition-colors">لوحة القيادة</a>
              <a href="/portal/workspace" className="hover:text-[#b08d57] transition-colors">مساحة العمل</a>
              <a href="/portal/leads" className="hover:text-[#b08d57] transition-colors">صندوق الطلبات</a>
            </div>

            <a 
              href="/portal/workspace" 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all backdrop-blur-md border border-white/10 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#b08d57]" />
              <span>مساحة الحجز الداخلية</span>
            </a>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-auto mb-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full liquid-glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#b08d57] animate-pulse" />
            <span className="text-sm font-medium text-slate-200 tracking-wider">نظام محرك البحث الاحترافي AlQadi Engine PRO</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-tight hero-heading mb-6 leading-none"
          >
            بوابة الحجز الذكي
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-12 font-light leading-relaxed"
          >
            محرك <strong className="text-white font-bold">AlQadi Engine PRO</strong> يدمج خوارزميات البحث الذكي المباشر لتوفير وإدارة حجوزات الطيران، الموافقات الأمنية، والخدمات اللوجستية المتكاملة لعملائنا في ثوانٍ.
          </motion.p>
          
          <Magnetic>
            <motion.a
              href="/portal/workspace"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="group relative px-10 py-5 bg-[#b08d57] hover:bg-[#8e6d3e] text-slate-900 rounded-full font-bold text-xl transition-all shadow-[0_0_40px_rgba(176,141,87,0.4)] hover:shadow-[0_0_60px_rgba(176,141,87,0.6)] flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10 text-slate-950 font-black">ابتدأ البحث والحجز الآن</span>
              <span className="relative z-10 bg-slate-900/10 p-2 rounded-full group-hover:-translate-x-2 transition-transform">
                <ArrowLeft className="w-5 h-5 text-slate-950" />
              </span>
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </motion.a>
          </Magnetic>
        </main>
      </section>

      {/* SECTION 2 — BENTO GRID OPERATIONS */}
      <section className="relative z-20 -mt-32 max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-3 gap-6">
          
          {/* Card 1: 360 ENGINE */}
          <div className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] overflow-hidden relative aspect-square noise-overlay p-8 flex flex-col justify-end group">
            <BoomerangVideoBg src={RADAR_VIDEO_URL} isRadar={true} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#b08d57]/10 flex items-center justify-center mb-4 border border-[#b08d57]/30">
                <Globe className="w-6 h-6 text-[#b08d57]" />
              </div>
              <h3 className="text-5xl font-black text-white mb-2">360°</h3>
              <p className="text-slate-400 font-medium">رادار مراقبة الرحلات الذكي لتحديث الحجوزات والأسعار مباشرة بثوانٍ معدودة.</p>
            </div>
          </div>

          {/* Card 2: SUCCESS RATE */}
          <div className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] p-8 flex flex-col justify-between noise-overlay">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#b08d57]/10 flex items-center justify-center border border-[#b08d57]/30">
                  <BarChart3 className="w-6 h-6 text-[#b08d57]" />
                </div>
                <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  مباشر نشط
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 font-cairo">معدل دقة وإنجاز الحجوزات</h3>
              <p className="text-slate-400 text-sm">أداء النظام وخادم المزامنة التلقائي خلال الـ 24 ساعة الماضية</p>
            </div>
            
            <div className="mt-8">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-black text-white">99.98</span>
                <span className="text-xl text-[#b08d57] font-bold mb-2">%</span>
              </div>
              {/* Animated Progress Line */}
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '99.98%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#b08d57]/50 to-[#b08d57] rounded-full relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-sm -skew-x-12 animate-[slide_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Column for Cards 3 & 4 */}
          <div className="md:col-span-6 xl:col-span-1 flex flex-col gap-6">
            
            {/* Card 3: DAILY TOOLS (Marquees) */}
            <div className="flex-1 liquid-glass rounded-[2rem] p-8 overflow-hidden relative noise-overlay min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 w-[200%] animate-marquee-right">
                  <Tile icon={Plane} /><Tile icon={Ticket} /><Tile icon={ShieldCheck} /><Tile icon={Database} />
                  {/* Duplicate for loop */}
                  <Tile icon={Plane} /><Tile icon={Ticket} /><Tile icon={ShieldCheck} /><Tile icon={Database} />
                </div>
                <div className="flex gap-4 w-[200%] animate-marquee-left ml-[-50%]">
                  <Tile icon={Search} /><Tile icon={CheckCircle2} /><Tile icon={Navigation} /><Tile icon={Clock} />
                  {/* Duplicate for loop */}
                  <Tile icon={Search} /><Tile icon={CheckCircle2} /><Tile icon={Navigation} /><Tile icon={Clock} />
                </div>
              </div>
            </div>

            {/* Card 4: EMERGENCY TEAM */}
            <a href="tel:+967111111" className="h-40 liquid-glass cinematic-hover rounded-[2rem] p-6 flex items-center justify-between noise-overlay group cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#b08d57]/10 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2 font-cairo">فريق الدعم والعمليات</h3>
                <p className="text-slate-400">مستعدون 24/7 لحل أي إشكالات تقنية أو لوجستية فوراً</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#b08d57] flex items-center justify-center text-slate-900 group-hover:bg-white transition-colors relative z-10 shadow-lg shadow-[#b08d57]/20">
                <PhoneCall className="w-7 h-7 text-slate-950" />
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 3 — WORKFLOW EXPERIENCE */}
      <section className="bg-slate-50 text-slate-900 rounded-t-[3rem] px-6 py-32 relative z-30">
        <WorkflowText />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {[
            { step: "01", title: "استلام وتحليل الطلبات", desc: "نستقبل طلبات الحجز من العملاء ونحلل متطلباتهم اللوجستية بدقة (الوجهات، التواريخ، والخدمات الخاصة) لضمان الخيار الأنسب.", icon: Users },
            { step: "02", title: "البحث الذكي المباشر", desc: "يقوم محرك AlQadi بمسح مباشر لكافة خطوط الطيران والمزودين لتقديم عروض توازن بين السعر والموثوقية والسرعة.", icon: ShieldCheck },
            { step: "03", title: "تأكيد فوري وإصدار", desc: "إصدار فوري للتذاكر وتوفير الموافقات الأمنية وإرسال تأكيد الحجز إلى العميل مباشرة عبر قنوات التواصل المعتمدة.", icon: CheckCircle2 }
          ].map((item, i) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="flex flex-col items-start group"
            >
              <div className="flex items-end gap-3 mb-6">
                <span className="text-6xl font-black text-slate-200 tracking-tighter transition-colors group-hover:text-[#b08d57]">{item.step}</span>
                <span className="w-12 h-1 bg-[#b08d57] mb-2 rounded-full" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#b08d57] flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-[#b08d57]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-cairo">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-cairo">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

    </div>
  );
}
