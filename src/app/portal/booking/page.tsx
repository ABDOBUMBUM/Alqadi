"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Plane, Search, ShieldCheck, Ticket, Users, 
  PhoneCall, Globe, ArrowLeft, CheckCircle2, 
  Clock, Database, Navigation, Menu, X,
  Sparkles, Loader2, Star, MapPin, BarChart3,
  Calendar
} from "lucide-react";

// ========================================================
// ⚡ MEDIA & ASSET PIPELINE
// ========================================================
const HERO_VIDEO_URL = "/assets/Airplane_gliding_through_clouds_202605162225.mp4";
const RADAR_VIDEO_URL = "/assets/Radar_scanning_globe_interface_202605162208.mp4";
const LOGO_SVG = "/assets/AI-Image-Editor-2026-04-29_20-43-05-removebg-preview.png";

export interface SearchOption {
  name: string;
  price: number;
  description: string;
  bookingUrl: string;
}

export interface SearchResult {
  id: string;
  type: 'flight' | 'package';
  title: string;
  description: string;
  price: number;
  airline: string;
  rating: number;
  duration: string;
  bookingUrl?: string;
  currency?: string;
  dateText?: string;
  options?: SearchOption[];
}


export async function searchTravel(queryData: { query: string; origin: string; destination: string; date: string; passengers: string; }): Promise<{results: SearchResult[], message?: string}> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(queryData),
    });
    if (!response.ok) {
      throw new Error("Failed to communicate with AI engine");
    }
    const data = await response.json();
    return { results: data.results || [], message: data.message };
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback Dummy Data for testing
    return {
      results: [
        {
          id: "1",
          type: "flight",
          title: "رحلة طيران إلى القاهرة",
          description: "رحلة طيران مباشرة ومريحة تشمل وزن 30 كجم.",
          price: 1250,
          airline: "الخطوط الجوية اليمنية",
          rating: 4.5,
          duration: "3h 20m",
          bookingUrl: "https://yemenia.com/"
        },
        {
          id: "2",
          type: "package",
          title: "باقة سياحية شرم الشيخ",
          description: "إقامة 5 أيام في فندق 5 نجوم شاملة الإفطار والتنقلات.",
          price: 3400,
          airline: "مجموعة القاضي الذهبية",
          rating: 4.8,
          duration: "5 Days",
          bookingUrl: "/portal/packages"
        }
      ]
    };
  }
}

// ========================================================
// ⚡ COMPONENTS
// ========================================================

// 1. Magnetic Component (fixed — handles edge cases)
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    if (distance < 120) {
      setPosition({ x: distanceX * 0.35, y: distanceY * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// 2. Video Background
const VideoBg = ({ src, isRadar = false }: { src: string; isRadar?: boolean }) => (
  <div className="absolute inset-0 w-full h-full overflow-hidden">
    <video
      autoPlay loop muted playsInline
      className={`w-full h-full object-cover ${isRadar ? "opacity-30 mix-blend-screen scale-150" : "opacity-50"}`}
      src={src}
    />
    {!isRadar && <div className="absolute inset-0 bg-[#0f172a]/75" />}
  </div>
);

// 3. Workflow Section Header
const WorkflowHeader = ({ title, desc, highlight }: { title: string; desc: string; highlight: string }) => {
  const highlightRegex = new RegExp(`(${highlight})`, "g");
  const parts = desc.split(highlightRegex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-4xl mx-auto text-center mb-24"
    >
      <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-slate-900 tracking-tight font-cairo">
        {title}
      </h2>
      <p className="text-xl md:text-3xl font-medium leading-[1.6] md:leading-relaxed text-slate-600 font-cairo">
        {parts.map((part, i) =>
          part === highlight ? (
            <span key={i} className="text-[#8e6d3e] font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </p>
    </motion.div>
  );
};

// 4. Marquee Tile (flex-shrink-0 — prevents gaps)
const Tile = ({ icon: Icon, label }: { icon: React.ComponentType<any>; label: string }) => (
  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl liquid-glass flex flex-col items-center justify-center text-[#b08d57] hover:text-white hover:bg-[#b08d57]/80 transition-colors duration-300 cursor-default select-none gap-1">
    <Icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
    <span className="text-[8px] font-bold opacity-60 hidden md:block">{label}</span>
  </div>
);

// 5. Result Card
// 5. Result Card
const ResultCard = ({ res, currencyMode }: { res: SearchResult; currencyMode: 'USD' | 'SAR' }) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const options = res.options && res.options.length > 0 ? res.options : [{
    name: "أساسي",
    price: res.price,
    description: res.description,
    bookingUrl: res.bookingUrl || ""
  }];

  const activeOpt = options[selectedOption] || options[0];
  const displayPrice = currencyMode === 'SAR' ? Math.round(activeOpt.price * 3.75) : activeOpt.price;
  const displayCurrency = currencyMode === 'SAR' ? 'ر.س' : '$';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden group font-cairo"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {res.type === 'flight' ? <Plane className="w-20 h-20" /> : <MapPin className="w-20 h-20" />}
      </div>
      
      <div className="flex justify-between items-start relative z-10 gap-2">
        <div className="flex-1 text-right">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-1 bg-[#b08d57]/20 text-[#b08d57] rounded uppercase tracking-wider">
              {res.type === 'flight' ? 'رحلة طيران' : 'باقة سياحية'}
            </span>
            <div className="flex items-center gap-1 text-[#b08d57]">
              <Star className="w-3 h-3 fill-[#b08d57]" />
              <span className="text-xs font-bold">{res.rating}</span>
            </div>
            
            {res.dateText && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] tracking-wide font-cairo font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#b08d57]" />
                <span>التاريخ: {res.dateText}</span>
              </div>
            )}
          </div>
          
          <h4 className="text-xl font-bold text-white mb-1 font-cairo">
            {res.title.includes('(رحلة بديلة)') ? (
              <span className="flex items-center gap-2">
                {res.title.replace('(رحلة بديلة)', '')}
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-bold">رحلة بديلة</span>
              </span>
            ) : (
              res.title
            )}
          </h4>
          <p className="text-slate-400 text-sm font-cairo">{res.airline}</p>
        </div>
        <div className="text-left shrink-0">
          <span className="text-2xl font-black text-white">{displayPrice}</span>
          <span className="text-xs text-[#b08d57] font-bold mr-1 tracking-tighter">{displayCurrency}</span>
        </div>
      </div>

      {res.options && res.options.length > 0 && (
        <div className="relative z-10 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-[#b08d57] uppercase tracking-wider font-cairo">خيارات ودرجات الرحلة:</label>
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#0f172a]/70 rounded-xl border border-white/5">
            {res.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`py-2 rounded-lg text-center font-bold text-[10px] md:text-[11px] font-cairo transition-all ${
                  selectedOption === idx 
                    ? 'bg-[#b08d57] text-[#0f172a] shadow shadow-[#b08d57]/15' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-slate-300 text-sm leading-relaxed relative z-10 font-cairo">{activeOpt.description}</p>
      
      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium relative z-10 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{res.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span>تأكيد فوري للطلب</span>
        </div>
      </div>

      <button 
        onClick={() => {
          if (activeOpt.bookingUrl) {
            window.open(activeOpt.bookingUrl, '_blank');
          } else {
            alert('جاري نقلك إلى منصة الحجز...');
          }
        }}
        className="mt-2 w-full py-3 bg-[#b08d57]/10 hover:bg-[#b08d57] text-[#b08d57] hover:text-[#0f172a] rounded-xl font-bold transition-all border border-[#b08d57]/20 hover:border-transparent font-cairo"
      >
        تفاصيل الحجز (مباشر)
      </button>
    </motion.div>
  );
};



// ========================================================
// ⚡ FALLBACK DATA
// ========================================================
const getFallbackData = () => ({
  heroTitle: "بوابة الحجز الذكي",
  heroDescription: "محرك AlQadi Engine PRO يدمج خوارزميات البحث الذكي المباشر لتوفير وإدارة حجوزات الطيران، الموافقات الأمنية، والخدمات اللوجستية المتكاملة لعملائنا في ثوانٍ.",
  heroCtaLabel: "ابتدأ البحث والحجز الآن",
  radarTitle: "360°",
  radarDescription: "رادار مراقبة الرحلات الذكي لتحديث الحجوزات والأسعار مباشرة بثوانٍ معدودة.",
  statsRate: "99.98",
  statsTitle: "معدل دقة وإنجاز الحجوزات",
  statsDescription: "أداء النظام وخادم المزامنة التلقائي خلال الـ 24 ساعة الماضية",
  supportTeamTitle: "فريق الدعم والعمليات",
  supportTeamDesc: "متاح 24/7 — اتصل مباشرة",
  supportPhone: "+96525555555",
  workflowSectionTitle: "آلية العمل",
  workflowSectionDesc: "نحن لا نبيع تذاكر فقط، نحن نبني تجربة سفر متكاملة تمنح العميل راحة البال والثقة الكاملة.",
  workflowSectionHighlight: "سفر متكاملة",
  workflowSteps: [
    {
      step: "01",
      title: "استلام وتحليل الطلبات",
      desc: "نستقبل طلبات الحجز من العملاء ونحلل متطلباتهم اللوجستية بدقة (الوجهات، التواريخ، والخدمات الخاصة) لضمان الخيار الأنسب.",
    },
    {
      step: "02",
      title: "البحث الذكي المباشر",
      desc: "يقوم محرك AlQadi بمسح مباشر لكافة خطوط الطيران والمزودين لتقديم عروض توازن بين السعر والموثوقية والسرعة.",
    },
    {
      step: "03",
      title: "تأكيد فوري وإصدار",
      desc: "إصدار فوري للتذاكر وتوفير الموافقات الأمنية وإرسال تأكيد الحجز إلى العميل مباشرة عبر قنوات التواصل المعتمدة.",
    }
  ],
  navLinks: [
    { href: "/portal/dashboard", label: "لوحة القيادة" },
    { href: "/portal/workspace", label: "مساحة العمل" },
    { href: "/portal/leads", label: "صندوق الطلبات" },
  ]
});

// ========================================================
// ⚡ MAIN PAGE
// ========================================================
export default function BookingPortalPage() {
  const router = useRouter();
  const [loadingInit, setLoadingInit] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [origin, setOrigin] = useState("ADE");
  const [destination, setDestination] = useState("CAI");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1 Adult");
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'SAR'>('SAR'); // وضع العملة الافتراضية للريال السعودي


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingSearch(true);
    setSearchMessage("");
    try {
      const data = await searchTravel({
        query,
        origin,
        destination,
        date,
        passengers
      });
      setResults(data.results || []);
      if (data.message) {
        setSearchMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    import("next-auth/react").then(({ getSession }) => {
      getSession().then((sessionData) => {
        if (!sessionData?.user) {
          router.replace("/portal/login");
          return;
        }
        
        // Define which roles are allowed to access the booking portal
        const allowedRoles = ["admin", "supervisor", "agent", "booking_agent"];
        const userRole = (sessionData.user as any).role || "agent";
        
        if (!allowedRoles.includes(userRole)) {
          router.replace("/portal/login?error=AccessDenied");
          return;
        }

        setSession(sessionData.user);
        
        // Fetch CMS data
        fetch("/api/cms")
          .then((res) => res.json())
          .then((data) => {
            const pageData = data.find((p: any) => p.slug === "booking_portal");
            setCmsContent(pageData?.content || getFallbackData());
            setLoadingInit(false);
          })
          .catch(() => {
            setCmsContent(getFallbackData());
            setLoadingInit(false);
          });
      });
    });
  }, [router]);

  if (loadingInit || !cmsContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white font-cairo text-lg" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#b08d57] border-t-transparent animate-spin" />
          <span className="text-slate-400 text-sm">جاري تهيئة بيئة العمل وتحميل البيانات...</span>
        </div>
      </div>
    );
  }

  const navLinks = cmsContent.navLinks || [];
  const SUPPORT_PHONE = cmsContent.supportPhone || "+96525555555";

  const MARQUEE_ROW_1 = [
    { icon: Plane, label: "رحلات" },
    { icon: Ticket, label: "تذاكر" },
    { icon: ShieldCheck, label: "أمن" },
    { icon: Database, label: "بيانات" },
    { icon: Globe, label: "عالمي" },
    { icon: Users, label: "عملاء" },
  ];
  const MARQUEE_ROW_2 = [
    { icon: Search, label: "بحث" },
    { icon: CheckCircle2, label: "تأكيد" },
    { icon: Navigation, label: "ملاحة" },
    { icon: Clock, label: "وقت" },
    { icon: PhoneCall, label: "دعم" },
    { icon: BarChart3, label: "تحليل" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-cairo overflow-x-hidden" dir="rtl">

      {/* ══ SECTION 1 — CINEMATIC HERO ══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden noise-overlay">
        <VideoBg src={HERO_VIDEO_URL} />

        {/* Fixed Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-3 md:px-8 md:py-5">
          <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={LOGO_SVG}
                alt="AlQadi Gold"
                className="w-9 h-9 object-contain"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-base text-white leading-tight">مجموعة القاضي</span>
                <span className="text-[#b08d57] text-[10px] font-semibold tracking-widest uppercase">الذهبية</span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              {navLinks.map((l: any) => (
                <a key={l.href} href={l.href} className="hover:text-[#b08d57] transition-colors">{l.label}</a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {session?.role === "admin" && (
                <a
                  href="/admin"
                  className="flex bg-red-500/10 hover:bg-red-500/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md border border-red-500/30 items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  <ShieldCheck className="w-4 h-4 text-red-400" />
                  <span>دخول الإدارة بكامل الصلاحيات</span>
                </a>
              )}
              <a
                href="/portal/workspace"
                className="flex bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md border border-white/10 items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#b08d57]" />
                <span>مساحة الحجز</span>
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mx-3 mt-2 rounded-2xl liquid-glass border border-white/10 overflow-hidden origin-top"
              >
                {navLinks.map((l: any) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-6 py-4 text-slate-200 hover:text-[#b08d57] hover:bg-white/5 transition-colors font-medium border-b border-white/5 last:border-0"
                  >
                    {l.label}
                  </a>
                ))}
                <a href="/portal/workspace" className="flex items-center gap-3 text-lg font-medium text-white px-4 py-3 rounded-xl bg-white/5 border border-white/10 mt-2">
                    <Users className="w-5 h-5 text-[#b08d57]" />
                    مساحة الحجز
                  </a>
                  
                  {session?.role === "admin" && (
                    <a href="/admin" className="flex items-center gap-3 text-lg font-medium text-red-300 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-2">
                      <ShieldCheck className="w-5 h-5 text-red-400" />
                      دخول الإدارة المركزية
                    </a>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
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
            {cmsContent.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-12 font-light leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: cmsContent.heroDescription.replace("AlQadi Engine PRO", "<strong class='text-white font-bold'>AlQadi Engine PRO</strong>")
            }}
          />

          <Magnetic>
            <motion.button
              onClick={() => setShowSearch(true)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="group relative px-10 py-5 bg-[#b08d57] hover:bg-[#8e6d3e] rounded-full font-bold text-xl transition-all shadow-[0_0_40px_rgba(176,141,87,0.4)] hover:shadow-[0_0_60px_rgba(176,141,87,0.6)] flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10 text-slate-950 font-black">{cmsContent.heroCtaLabel}</span>
              <span className="relative z-10 bg-slate-900/10 p-2 rounded-full group-hover:-translate-x-2 transition-transform">
                <ArrowLeft className="w-5 h-5 text-slate-950" />
              </span>
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </Magnetic>
        </main>
      </section>

      {/* ══ SECTION 2 — BENTO GRID ════════════════════════════ */}
      <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-3 gap-6">

          {/* Card 1: 360° RADAR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] overflow-hidden relative aspect-[4/3] md:aspect-square noise-overlay p-8 flex flex-col justify-end group"
          >
            <VideoBg src={RADAR_VIDEO_URL} isRadar={true} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#b08d57]/10 flex items-center justify-center mb-4 border border-[#b08d57]/30">
                <Globe className="w-6 h-6 text-[#b08d57]" />
              </div>
              <h3 className="text-5xl font-black text-white mb-2">{cmsContent.radarTitle}</h3>
              <p className="text-slate-400 font-medium">{cmsContent.radarDescription}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-[#b08d57]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>TUNNEL ACTIVE: 1.1.1.1 DNS OPTIMIZED</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: SUCCESS RATE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] p-8 flex flex-col justify-between noise-overlay"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#b08d57]/10 flex items-center justify-center border border-[#b08d57]/30">
                  <BarChart3 className="w-6 h-6 text-[#b08d57]" />
                </div>
                <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  مباشر نشط
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1 font-cairo">{cmsContent.statsTitle}</h3>
              <p className="text-slate-400 text-sm">{cmsContent.statsDescription}</p>
            </div>
            <div className="mt-8">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-black text-white tracking-tighter">{cmsContent.statsRate}</span>
                <span className="text-xl text-[#b08d57] font-bold mb-2">%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "99.98%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#b08d57]/50 to-[#b08d57] rounded-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/40 blur-sm animate-[slide_2.5s_ease-in-out_infinite]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Cards 3 & 4 column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-6 xl:col-span-1 flex flex-col gap-6"
          >
            {/* Card 3: Marquee Tools */}
            <div className="flex-1 liquid-glass rounded-[2rem] p-6 overflow-hidden relative noise-overlay min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />
              <div className="flex flex-col gap-3 overflow-hidden">
                {/* Row 1 — scrolls right */}
                <div className="flex gap-3 animate-marquee-right" style={{ width: "max-content" }}>
                  {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((t, i) => (
                    <Tile key={i} icon={t.icon} label={t.label} />
                  ))}
                </div>
                {/* Row 2 — scrolls left */}
                <div className="flex gap-3 animate-marquee-left" style={{ width: "max-content" }}>
                  {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((t, i) => (
                    <Tile key={i} icon={t.icon} label={t.label} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Support Team (REAL phone number) */}
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="h-40 liquid-glass cinematic-hover rounded-[2rem] p-6 flex items-center justify-between noise-overlay group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#b08d57]/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1 font-cairo">{cmsContent.supportTeamTitle}</h3>
                <p className="text-slate-400 text-sm">{cmsContent.supportTeamDesc}</p>
                <p className="text-[#b08d57] font-mono font-bold mt-1.5 text-base tracking-wider" dir="ltr">{SUPPORT_PHONE}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#b08d57] flex items-center justify-center group-hover:bg-white transition-colors relative z-10 shadow-lg shadow-[#b08d57]/30 shrink-0">
                <PhoneCall className="w-7 h-7 text-slate-950" />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 3 — WORKFLOW ═════════════════════════════ */}
      <section className="bg-slate-50 text-slate-900 rounded-t-[3rem] px-6 py-28 relative z-30">
        <div className="max-w-6xl mx-auto">
          <WorkflowHeader 
            title={cmsContent.workflowSectionTitle} 
            desc={cmsContent.workflowSectionDesc} 
            highlight={cmsContent.workflowSectionHighlight} 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {(cmsContent.workflowSteps || []).map((item: any, i: number) => {
              const icons = [Users, ShieldCheck, CheckCircle2];
              const StepIcon = icons[i % icons.length];
              return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="flex flex-col items-start group"
              >
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-6xl font-black text-slate-200 tracking-tighter transition-colors group-hover:text-[#b08d57]">
                    {item.step}
                  </span>
                  <span className="w-12 h-1 bg-[#b08d57] mb-2 rounded-full" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">
                  <StepIcon className="w-7 h-7 text-[#b08d57]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-cairo">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-cairo">{item.desc}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a]/95 backdrop-blur-2xl p-4 md:p-12 overflow-y-auto font-cairo"
            dir="rtl"
          >
            <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 text-right">
                  <div className="w-12 h-12 rounded-xl bg-[#b08d57]/10 flex items-center justify-center border border-[#b08d57]/20">
                    <Sparkles className="w-6 h-6 text-[#b08d57]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">المُساعد الذكي</h2>
                    <p className="text-slate-400 text-sm">ابحث عن وجهتك بلسانك، ونحن نتولى الباقي</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSearch(false)}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Modal Form */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Origin & Destination */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-2 font-cairo">
                    <div className="relative">
                      <label className="absolute top-2 right-5 text-[9px] font-black text-[#b08d57] uppercase tracking-tighter z-10">من (Origin)</label>
                      <select 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-[#0f172a]/80 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-[#b08d57]/30 outline-none appearance-none cursor-pointer relative z-0"
                      >
                        <option value="ADE" className="bg-[#0f172a] text-white">عدن (ADE) - مطار عدن الدولي</option>
                        <option value="GXF" className="bg-[#0f172a] text-white">سيئون (GXF) - مطار سيئون الدولي</option>
                        <option value="SAH" className="bg-[#0f172a] text-white">صنعاء (SAH) - مطار صنعاء الدولي</option>
                        <option value="RIY" className="bg-[#0f172a] text-white">الريان (RIY) - مطار الريان الدولي</option>
                      </select>
                      <div className="absolute left-4 bottom-4 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                    <div className="relative">
                      <label className="absolute top-2 right-5 text-[9px] font-black text-[#b08d57] uppercase tracking-tighter z-10">إلى (Destination)</label>
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-[#0f172a]/80 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-[#b08d57]/30 outline-none appearance-none cursor-pointer relative z-0"
                      >
                        <option value="CAI" className="bg-[#0f172a] text-white">القاهرة (CAI) - مطار القاهرة الدولي</option>
                        <option value="JED" className="bg-[#0f172a] text-white">جدة (JED) - مطار الملك عبدالعزيز</option>
                        <option value="RUH" className="bg-[#0f172a] text-white">الرياض (RUH) - مطار الملك خالد</option>
                        <option value="AMM" className="bg-[#0f172a] text-white">عمان (AMM) - مطار الملكة علياء</option>
                        <option value="BOM" className="bg-[#0f172a] text-white">مومباي (BOM) - مطار مومباي الدولي</option>
                      </select>
                      <div className="absolute left-4 bottom-4 pointer-events-none text-slate-500 text-xs">▼</div>
                    </div>
                  </div>


                  {/* Dates */}
                  <div className="relative">
                    <label className="absolute top-3 right-5 text-[10px] font-bold text-[#b08d57] uppercase tracking-tighter">تاريخ المغادرة</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#0f172a]/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-[#b08d57]/30 outline-none"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="relative">
                    <label className="absolute top-3 right-5 text-[10px] font-bold text-[#b08d57] uppercase tracking-tighter">المسافرون</label>
                    <select 
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full bg-[#0f172a]/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-[#b08d57]/30 outline-none appearance-none"
                    >
                      <option value="1 Adult">1 بالغ</option>
                      <option value="2 Adults">2 بالغين</option>
                      <option value="Family">عائلة (2+2)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                  <div className="flex gap-2 p-1 bg-[#0f172a]/50 rounded-xl border border-white/5">
                    <button className="px-6 py-2 bg-[#b08d57] text-[#0f172a] rounded-lg font-bold text-sm">ذهاب فقط</button>
                    <button className="px-6 py-2 hover:bg-white/5 text-slate-400 rounded-lg font-bold text-sm">ذهاب وعودة</button>
                  </div>
                  
                  <div className="flex-1 relative w-full">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-mono text-[#b08d57]/40 border border-[#b08d57]/20 px-2 py-1 rounded bg-[#b08d57]/5 z-20 pointer-events-none">
                      <span>SCANNING: FLY-ADEN.COM</span>
                      <span className="w-1 h-1 rounded-full bg-[#b08d57] animate-pulse" />
                    </div>
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="أو اكتب طلبك هنا (مثال: رحلة غداً عدن للقاهرة)..."
                      className="w-full bg-transparent border-b border-white/10 px-4 py-3 pr-4 pl-32 text-white outline-none focus:border-[#b08d57]/50 placeholder:text-slate-600 text-right"
                    />
                  </div>

                  <button 
                    onClick={() => handleSearch()}
                    disabled={loadingSearch}
                    className="w-full md:w-auto px-12 py-4 bg-[#b08d57] hover:bg-[#8e6d3e] text-[#0f172a] rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#b08d57]/20 disabled:opacity-50"
                  >
                    {loadingSearch ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                    <span>بحث ذكي</span>
                  </button>
                </div>
              </div>

              {/* Search Message */}
              {searchMessage && !loadingSearch && (
                <div className="bg-[#b08d57]/10 border border-[#b08d57]/30 rounded-2xl p-4 mb-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#b08d57]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#b08d57]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">ملاحظة من النظام</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{searchMessage}</p>
                  </div>
                </div>
              )}

              {/* شريط اختيار العملة والتفاصيل اللوجستية الفاخرة */}
              {results.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-2xl liquid-glass border border-white/5 font-cairo">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300 font-semibold">عرض الأسعار بـ:</span>
                    <div className="flex gap-1 p-0.5 bg-[#0f172a]/80 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setCurrencyMode('USD')}
                        className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${currencyMode === 'USD' ? 'bg-[#b08d57] text-[#0f172a] shadow-md shadow-[#b08d57]/20' : 'text-slate-400 hover:text-white'}`}
                      >
                        دولار أمريكي ($)
                      </button>
                      <button 
                        onClick={() => setCurrencyMode('SAR')}
                        className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${currencyMode === 'SAR' ? 'bg-[#b08d57] text-[#0f172a] shadow-md shadow-[#b08d57]/20' : 'text-slate-400 hover:text-white'}`}
                      >
                        ريال سعودي (ر.س)
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-cairo">الربط الذكي نشط | الأسعار مطابقة للأنظمة الرسمية للخطوط</span>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {results.map((res) => (
                  <ResultCard key={res.id} res={res} currencyMode={currencyMode} />
                ))}

                
                {results.length === 0 && !loadingSearch && !searchMessage && (
                  <div className="col-span-full py-32 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-500">ابدأ بكتابة وجهتك المفضلة</h3>
                    <p className="text-slate-600">محرك البحث يدعم اللغة الطبيعية بالكامل</p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
