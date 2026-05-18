/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { 
  Plane, Search, ShieldCheck, Ticket, Users, 
  PhoneCall, Globe, ArrowLeft, CheckCircle2, 
  Clock, Database, Navigation,
  X, Sparkles, Loader2, Star, MapPin, BarChart3
} from 'lucide-react';
import { searchTravel, SearchResult } from './services/aiService';

// ========================================================
// ⚡ MEDIA & ASSET PIPELINE
// ========================================================
const HERO_VIDEO_URL = "https://cdn.pixabay.com/video/2018/06/07/16616-273612863_large.mp4"; 
const RADAR_VIDEO_URL = "https://cdn.pixabay.com/video/2021/04/13/70997-536968602_large.mp4"; 

const LogoSvg = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10L10 30V70L50 90L90 70V30L50 10Z" stroke="#b08d57" strokeWidth="4" fill="rgba(176,141,87,0.1)" />
    <path d="M50 25L25 40V60L50 75L75 60V40L50 25Z" fill="#b08d57" />
    <path d="M50 5L50 95" stroke="#b08d57" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
    <circle cx="50" cy="50" r="10" fill="#0f172a" />
  </svg>
);

// ========================================================
// ⚡ COMPONENTS
// ========================================================

const BoomerangVideoBg = ({ src, className, isRadar = false }: { src: string, className?: string, isRadar?: boolean }) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover ${isRadar ? 'opacity-40 mix-blend-screen scale-150' : 'opacity-60'}`}
        src={src}
      />
      {!isRadar && <div className="absolute inset-0 bg-[#0f172a]/70" />}
    </div>
  );
};

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
      <p className="text-2xl md:text-4xl font-medium leading-[1.6] md:leading-relaxed text-slate-600 font-cairo">
        نحن لا نبيع تذاكر فقط، نحن نبني تجربة <span className="text-gold-dark font-bold">سفر متكاملة</span> تمنح العميل راحة البال والثقة الكاملة.
      </p>
    </motion.div>
  );
};

const Tile = ({ icon: Icon }: { icon: any }) => (
  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl liquid-glass flex items-center justify-center text-gold hover:text-white hover:bg-gold transition-colors duration-300">
    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
  </div>
);

const ResultCard = ({ res }: { res: SearchResult }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden group font-cairo"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {res.type === 'flight' ? <Plane className="w-20 h-20" /> : <MapPin className="w-20 h-20" />}
    </div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-1 bg-gold/20 text-gold rounded uppercase tracking-wider">
            {res.type === 'flight' ? 'رحلة طيران' : 'باقة سياحية'}
          </span>
          <div className="flex items-center gap-1 text-gold">
            <Star className="w-3 h-3 fill-gold" />
            <span className="text-xs font-bold">{res.rating}</span>
          </div>
        </div>
        <h4 className="text-xl font-bold text-white mb-1">{res.title}</h4>
        <p className="text-slate-400 text-sm">{res.airline}</p>
      </div>
      <div className="text-left">
        <span className="text-2xl font-black text-white">{res.price}</span>
        <span className="text-xs text-gold font-bold mr-1 tracking-tighter">ر.س</span>
      </div>
    </div>

    <p className="text-slate-300 text-sm leading-relaxed relative z-10">{res.description}</p>
    
    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium relative z-10 border-t border-white/5 pt-4">
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{res.duration}</span>
      </div>
      <div className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        <span>تأكيد فوري</span>
      </div>
    </div>

    <button className="mt-2 w-full py-3 bg-white/5 hover:bg-gold hover:text-bg rounded-xl font-bold transition-all border border-white/5">
      تفاصيل الحجز
    </button>
  </motion.div>
);

// ========================================================
// ⚡ MAIN APP
// ========================================================

export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const [origin, setOrigin] = useState("ADE");
  const [destination, setDestination] = useState("CAI");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Combine inputs into a rich query for the backend
    const fullQuery = `${query} from ${origin} to ${destination}`;
    
    setLoading(true);
    try {
      const data = await searchTravel(fullQuery);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg font-cairo">
      
      {/* SECTION 1 — CINEMATIC HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden noise-overlay">
        <BoomerangVideoBg src={HERO_VIDEO_URL} />
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:px-8 md:py-6">
          <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogoSvg />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white leading-tight">مجموعة القاضي</span>
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">الذهبية</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-gold transition-colors">لوحة القيادة</a>
              <a href="#" className="hover:text-gold transition-colors">تقارير الطيران</a>
              <a href="#" className="hover:text-gold transition-colors">العمليات الذكية</a>
            </div>

            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all backdrop-blur-md border border-white/10 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>بوابة الموظفين</span>
            </button>
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
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-slate-200 tracking-wider">النظام مستعد للعمليات</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tight hero-heading mb-6"
          >
            نظام البحث الذكي
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-12 font-light leading-relaxed font-cairo"
          >
            منصة <strong className="text-white font-bold font-cairo">AlQadi Engine PRO</strong> تمنحك قوة الوصول المباشر لأفضل عروض الطيران والسياحة، بتجربة مستخدم لا تضاهى.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            onClick={() => setShowSearch(true)}
            className="group relative px-10 py-5 bg-gold hover:bg-gold-dark text-slate-900 rounded-full font-bold text-xl transition-all shadow-[0_0_40px_rgba(176,141,87,0.4)] hover:shadow-[0_0_60px_rgba(176,141,87,0.6)] flex items-center gap-4 overflow-hidden font-cairo"
          >
            <span className="relative z-10">ابدأ البحث الآن</span>
            <span className="relative z-10 bg-slate-900/10 p-2 rounded-full group-hover:-translate-x-2 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </motion.button>
        </main>
      </section>

      {/* SECTION 2 — BENTO GRID OPERATIONS */}
      <section className="relative z-20 -mt-32 max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-3 gap-6 font-cairo text-right" dir="rtl">
          
          {/* Card 1: 360 ENGINE */}
          <div className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] overflow-hidden relative aspect-square noise-overlay p-8 flex flex-col justify-end group">
            <BoomerangVideoBg src={RADAR_VIDEO_URL} isRadar={true} />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 border border-gold/30">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-5xl font-black text-white mb-2">360°</h3>
              <p className="text-slate-400 font-medium">رادار مراقبة الرحلات الشامل والبحث العميق المباشر.</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gold/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>TUNNEL ACTIVE: 1.1.1.1 DNS OPTIMIZED</span>
              </div>
            </div>
          </div>

          {/* Card 2: SUCCESS RATE */}
          <div className="md:col-span-3 xl:col-span-1 liquid-glass cinematic-hover rounded-[2rem] p-8 flex flex-col justify-between noise-overlay">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                  <BarChart3 className="w-6 h-6 text-gold" />
                </div>
                <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  مباشر
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">معدل الإنجاز</h3>
              <p className="text-slate-400 text-sm">أداء النظام خلال 24 ساعة الماضية</p>
            </div>
            
            <div className="mt-8">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-black text-white tracking-tighter">99.8</span>
                <span className="text-xl text-gold font-bold mb-2">%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '99.8%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full relative"
                />
              </div>
            </div>
          </div>

          {/* Column for Cards 3 & 4 */}
          <div className="md:col-span-6 xl:col-span-1 flex flex-col gap-6">
            
            {/* Card 3: DAILY TOOLS (Marquees) */}
            <div className="flex-1 liquid-glass rounded-[2rem] p-8 overflow-hidden relative noise-overlay min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent z-10" />
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 w-[200%] animate-marquee-right">
                  <Tile icon={Plane} /><Tile icon={Ticket} /><Tile icon={ShieldCheck} /><Tile icon={Database} />
                  <Tile icon={Plane} /><Tile icon={Ticket} /><Tile icon={ShieldCheck} /><Tile icon={Database} />
                </div>
                <div className="flex gap-4 w-[200%] animate-marquee-left ml-[-50%]">
                  <Tile icon={Search} /><Tile icon={CheckCircle2} /><Tile icon={Navigation} /><Tile icon={Clock} />
                  <Tile icon={Search} /><Tile icon={CheckCircle2} /><Tile icon={Navigation} /><Tile icon={Clock} />
                </div>
              </div>
            </div>

            {/* Card 4: EMERGENCY TEAM */}
            <div className="h-40 liquid-glass cinematic-hover rounded-[2rem] p-6 flex items-center justify-between noise-overlay group cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold/10 to-transparent" />
              <div className="relative z-10 text-right">
                <h3 className="text-2xl font-bold text-white mb-2">جدول الرحلات</h3>
                <p className="text-slate-400 text-sm font-mono">ADE ➔ CAI | GXF ➔ JED</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-slate-900 group-hover:bg-white transition-colors relative z-10 shadow-lg shadow-gold/20">
                <Clock className="w-7 h-7" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — WORKFLOW EXPERIENCE */}
      <section className="bg-slate-50 text-slate-900 rounded-t-[3rem] px-6 py-32 relative z-30 font-cairo">
        <WorkflowText />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-right" dir="rtl">
          
          {[
            { step: "01", title: "الاستلام والتحليل", desc: "نستقبل طلب العميل ونقوم بتحليل المعطيات بدقة (الوجوه، التواريخ، الميزانية) لضمان توفير أفضل مسار.", icon: Users },
            { step: "02", title: "البحث الشامل", desc: "يمسح محرك AlQadi كافة خطوط الطيران والمزودين لتقديم خيارات ذكية توازن بين السرعة والأمان والتكلفة.", icon: ShieldCheck },
            { step: "03", title: "الإغلاق البيعي", desc: "نقدّم التقرير النهائي للعميل بتجربة فاخرة، مع خيارات دفع مرنة وتأكيد فوري للحجز لضمان راحة البال.", icon: CheckCircle2 }
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
                <span className="text-6xl font-black text-slate-200 tracking-tighter transition-colors group-hover:text-gold">{item.step}</span>
                <span className="w-12 h-1 bg-gold mb-2 rounded-full" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-gold flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* SEARCH MODAL */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-bg/95 backdrop-blur-2xl p-4 md:p-12 overflow-y-auto font-cairo"
            dir="rtl"
          >
            <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 text-right">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                    <Sparkles className="w-6 h-6 text-gold" />
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
                  <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                    <div className="relative">
                      <label className="absolute top-3 right-5 text-[10px] font-bold text-gold uppercase tracking-tighter">من (Origin)</label>
                      <input 
                        type="text" 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                        className="w-full bg-bg/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-gold/30 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute top-3 right-5 text-[10px] font-bold text-gold uppercase tracking-tighter">إلى (Destination)</label>
                      <input 
                        type="text" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value.toUpperCase())}
                        className="w-full bg-bg/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-gold/30 outline-none"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="relative">
                    <label className="absolute top-3 right-5 text-[10px] font-bold text-gold uppercase tracking-tighter">تاريخ المغادرة</label>
                    <input 
                      type="date" 
                      className="w-full bg-bg/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-gold/30 outline-none"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="relative">
                    <label className="absolute top-3 right-5 text-[10px] font-bold text-gold uppercase tracking-tighter">المسافرون</label>
                    <select className="w-full bg-bg/50 border border-white/5 rounded-2xl px-5 py-6 pt-8 text-white focus:border-gold/30 outline-none appearance-none">
                      <option>1 بالغ</option>
                      <option>2 بالغين</option>
                      <option>عائلة (2+2)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                  <div className="flex gap-2 p-1 bg-bg/50 rounded-xl border border-white/5">
                    <button className="px-6 py-2 bg-gold text-bg rounded-lg font-bold text-sm">ذهاب فقط</button>
                    <button className="px-6 py-2 hover:bg-white/5 text-slate-400 rounded-lg font-bold text-sm">ذهاب وعودة</button>
                  </div>
                  
                  <div className="flex-1 relative w-full">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-mono text-gold/40 border border-gold/20 px-2 py-1 rounded bg-gold/5 z-20 pointer-events-none">
                      <span>SCANNING: FLY-ADEN.COM</span>
                      <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                    </div>
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="أو اكتب طلبك هنا (مثال: رحلة غداً عدن للقاهرة)..."
                      className="w-full bg-transparent border-b border-white/10 px-4 py-3 pr-4 pl-32 text-white outline-none focus:border-gold/50 placeholder:text-slate-600 text-right"
                    />
                  </div>

                  <button 
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-gold hover:bg-gold-dark text-bg rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                    <span>بحث ذكي</span>
                  </button>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                {results.map((res) => (
                  <ResultCard key={res.id} res={res} />
                ))}
                
                {results.length === 0 && !loading && (
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
