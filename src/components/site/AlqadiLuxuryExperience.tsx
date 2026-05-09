"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};

const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }
};

// Particle background component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      gold: boolean;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(40, Math.floor(window.innerWidth / 40));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.3 + 0.1,
          gold: Math.random() > 0.8
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.gold) {
          ctx.fillStyle = `rgba(232, 197, 71, ${p.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(232, 197, 71, 0.5)";
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(232, 197, 71, ${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

// Gold gradient text animation
function AnimatedGoldText({ text, className = "" }: { text: string; className?: string }) {
  const letters = text.split("");

  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={letterAnimation}
          className="inline-block"
          style={{ 
            background: "linear-gradient(115deg, #fff6d2 0%, #c9a227 35%, #f0e2a8 55%, #9a7614 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Navigation component — refined luxury nav
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "الرئيسية" },
    { href: "#services", label: "خدماتنا" },
    { href: "#about", label: "من نحن" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-deep/90 backdrop-blur-2xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-bg-deep font-bold text-sm">Q</span>
              </div>
              <span
                className="text-gold-400 font-semibold text-lg tracking-[0.15em] hidden sm:block"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                ALQADI
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground/70 hover:text-gold-400 transition-colors py-2 tracking-wide"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-px bg-gold-400"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-2.5 text-sm font-semibold text-bg-deep hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                احصل على عرض
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button suppressHydrationWarning
              className="md:hidden p-2 text-gold-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg-deep/98 backdrop-blur-2xl md:hidden pt-24"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-semibold text-foreground hover:text-gold-400 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3 text-base font-semibold text-bg-deep"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                احصل على عرض
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hero Section — cinematic full-bleed private jet hero
function HeroSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.08]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src="https://images.unsplash.com/photo-1529074961551-6b4c8c5e9e7f?auto=format&fit=crop&w=1920&q=80"
          alt="Private Jet"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Cinematic dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/60 via-bg-deep/40 to-bg-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/70 via-transparent to-bg-deep/50" />
      </motion.div>

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 w-full text-center">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-2 text-sm font-medium text-gold-400 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              PRIVATE AVIATION &amp; LUXURY TRAVEL
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <AnimatedGoldText text="ALQADI" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-3"
          >
            مجموعة القاضي الذهبية
          </motion.p>

          {/* Gold separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            للسفريات والسياحة وخدمة الأيادي العاملة — بوابة ذهبية نحو تجارب سفر راقية
            وشبكة توظيف موثوقة بمعايير امتياز عالمية
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.a
              href="#services"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-base font-semibold text-bg-deep shadow-xl shadow-gold-500/20"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(232, 197, 71, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">استكشف خدماتنا</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="rounded-full border border-gold-500/40 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-foreground hover:border-gold-400 hover:bg-gold-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تواصل معنا
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-foreground/40 tracking-[0.2em]">SCROLL</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-gold-500/30 flex justify-center pt-1.5"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div className="w-1 h-1 rounded-full bg-gold-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Fleet Showcase — cinematic jet imagery section
function FleetShowcase() {
  const fleetItems = [
    {
      image: "https://images.unsplash.com/photo-1540962351504-3169630c4e2b?auto=format&fit=crop&w=600&q=80",
      title: "طائرات خاصة",
      subtitle: "Private Jets",
    },
    {
      image: "https://images.unsplash.com/photo-1529074961551-6b4c8c5e9e7f?auto=format&fit=crop&w=600&q=80",
      title: "رحلات فاخرة",
      subtitle: "Luxury Flights",
    },
    {
      image: "https://images.unsplash.com/photo-1436491865332-6a61b6c5c4a1?auto=format&fit=crop&w=600&q=80",
      title: "وجهات عالمية",
      subtitle: "Global Destinations",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-semibold tracking-[0.3em] text-gold-500/80 mb-4"
          >
            OUR FLEET
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            أسطولنا الفاخر
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {fleetItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden border border-gold-500/15">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/30 to-transparent" />
                <div className="absolute inset-0 bg-bg-deep/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-gold-400 text-xs tracking-[0.2em] font-medium mb-1">{item.subtitle}</p>
                  <h3 className="text-foreground text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      title: "السياحة والسفريات",
      description: "نصمم لك رحلات بإيقاع هادئ وفخامة خالصة: حجوزات دقيقة، مرافقات احترافية، وتجارب وجهات تُروى كقصص ذهبية",
      features: [
        "تنسيق برامج سياحية مخصصة للعائلات والشركات",
        "حجوزات طيران وفنادق بمعايير امتياز",
        "تجارب وجهات عالمية بأسلوب عصري فاخر",
        "تأشيرات سفر وإجراءات جمركية",
      ],
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      title: "خدمة الأيادي العاملة",
      description: "نربط المؤسسات بالمواهب عبر مسارات واضحة، عقود شفافة، ومتابعة إنسانية تعكس قيم مجموعة القاضي الذهبية",
      features: [
        "توفير كوادر مؤهلة وفق متطلبات العمل",
        "ضبط جودة التوظيف والامتثال للأنظمة",
        "مسار موثوق نحو عقود واضحة",
        "دعم إرشادي يحترم الخبرة والطموح",
      ],
      gradient: "from-gold-500/20 to-yellow-600/20",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-18v18M6 7.5h3m-3 3h3m-3 3h3m6-6h3m-3 3h3m-3 3h3M3.75 21h16.5" />
        </svg>
      ),
      title: "الاستشارات المؤسسية",
      description: "حلول متكاملة للشركات في مجال السفر والموارد البشرية مع خدمة متميزة وعقود طويلة الأجل",
      features: [
        "عقود شراكة طويلة الأجل",
        "حلول مخصصة للشركات",
        "دعم فني على مدار الساعة",
        "تقارير دورية وتحليلات",
      ],
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-semibold tracking-[0.3em] text-gold-500/80 mb-4"
          >
            OUR SERVICES
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-gradient-gold mb-6"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            خدماتنا المميزة
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            نقدم لك باقة متكاملة من الخدمات الفاخرة بأعلى معايير الجودة العالمية
          </motion.p>
        </motion.div>

        {/* Services cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setActiveService(index)}
              className="group relative"
            >
              <motion.div
                className={`relative h-full rounded-3xl border border-gold-500/20 bg-gradient-to-br ${service.gradient} p-1 overflow-hidden`}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(232, 197, 71, 0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={activeService === index ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative h-full rounded-3xl bg-bg-panel/90 backdrop-blur-xl p-8">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center text-gold-400 mb-6"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {service.title}
                  </h3>

                  <p className="text-muted leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 text-sm text-foreground/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Hover button */}
                  <motion.button
                    className="mt-8 w-full py-3 rounded-xl border border-gold-500/30 text-gold-400 font-medium text-sm hover:bg-gold-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    اكتشف المزيد
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: 15, suffix: "+", label: "عاماً من الخبرة" },
    { number: 50000, suffix: "+", label: "عميل سعيد" },
    { number: 120, suffix: "+", label: "وجهة حول العالم" },
    { number: 98, suffix: "%", label: "نسبة الرضا" },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: index * 0.15 + 0.2 
                }}
              >
                <CountUp end={stat.number} suffix={stat.suffix} />
              </motion.div>
              <p className="text-sm md:text-base text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CountUp animation component
function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;
            const increment = end / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, stepTime);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// About Section
function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/95 to-bg-deep/80" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-semibold tracking-[0.3em] text-gold-500/80 mb-4"
            >
              ABOUT US
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              عن مجموعة القاضي الذهبية
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted leading-relaxed mb-6"
            >
              نجمع بين خبرة السفر والسياحة وخبرة إدارة الموارد البشرية تحت مظلة واحدة، 
              لنمنح شركاءنا تجربة متكاملة تعكس الجودة والاحترام في كل لقاء.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-foreground/80 leading-relaxed mb-8"
            >
              هوية بصرية مستوحاة من الامتياز الذهبي: دقة في التفاصيل، حضور عالمي، 
              وثقة تُبنى خطوة بخطوة. نؤمن بأن الفخامة تكمن في التفاصيل الصغيرة 
              والخدمة المتميزة التي تلامس قلب كل عميل.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-gold-500/20 bg-gold-500/5">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">جودة عالمية</span>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-gold-500/20 bg-gold-500/5">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">ثقة وموثوقية</span>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-gold-500/20 bg-gold-500/5">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">رضا العملاء</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Image grid */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="space-y-4"
                initial={{ y: 40 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-48 rounded-2xl overflow-hidden border border-gold-500/20">
                  <Image
                    src="https://images.unsplash.com/photo-1436491865332-6a61b6c5c4a1?auto=format&fit=crop&w=400&q=80"
                    alt="Luxury Travel"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden border border-gold-500/20">
                  <Image
                    src="https://images.unsplash.com/photo-1506929568582-5b5c1e4e4e0a?auto=format&fit=crop&w=400&q=80"
                    alt="Beach Resort"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
                </div>
              </motion.div>

              <motion.div
                className="space-y-4 pt-8"
                initial={{ y: -40 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative h-64 rounded-2xl overflow-hidden border border-gold-500/20">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                    alt="Team Meeting"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden border border-gold-500/20">
                  <Image
                    src="https://images.unsplash.com/photo-1488646890225-0737ea8c5f80?auto=format&fit=crop&w=400&q=80"
                    alt="Global Network"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 to-transparent" />
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 shadow-2xl shadow-gold-500/30"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <p className="text-bg-deep font-bold text-2xl">15+</p>
              <p className="text-bg-deep/80 text-sm">سنة خبرة</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "أحمد العلي",
      role: "رجل أعمال",
      content: "تجربة فريدة من نوعها، خدمة متميزة واهتمام بأدق التفاصيل. أنصح الجميع بالتعامل مع مجموعة القاضي الذهبية.",
      rating: 5,
    },
    {
      name: "سارة محمد",
      role: "مديرة موارد بشرية",
      content: "ساعدونا في توفير كوادر مؤهلة بكفاءة عالية، التعامل كان احترافياً والنتائج كانت مبهرة.",
      rating: 5,
    },
    {
      name: "خالد العمر",
      role: "مسافر دائم",
      content: "أفضل تجربة سفر مررت بها، كل شيء كان منظماً بشكل مثالي. شكراً لفريق القاضي الذهبية.",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-semibold tracking-[0.3em] text-gold-500/80 mb-4"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-gradient-gold"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            آراء عملائنا
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full rounded-3xl border border-gold-500/20 bg-bg-panel/80 backdrop-blur-xl p-8">
                {/* Quote icon */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg-deep" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-5 h-5 text-gold-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </motion.svg>
                  ))}
                </div>

                <p className="text-foreground/90 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-bg-deep font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: "", email: "", phone: "", service: "", message: "" });
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-semibold tracking-[0.3em] text-gold-500/80 mb-4"
            >
              CONTACT US
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gradient-gold mb-6"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              تواصل معنا
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted leading-relaxed mb-8"
            >
              نحن هنا لمساعدتك في رحلتك نحو تجربة سفر فاخرة أو خدمة توظيف متميزة.
              تواصل معنا الآن واحصل على استشارة مجانية.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted">الهاتف</p>
                  <p className="font-semibold text-foreground">+966 XX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted">البريد الإلكتروني</p>
                  <p className="font-semibold text-foreground">info@alqadi.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted">الموقع</p>
                  <p className="font-semibold text-foreground">المملكة العربية السعودية</p>
                </div>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="mt-10">
              <p className="text-sm text-muted mb-4">تابعنا على</p>
              <div className="flex gap-3">
                {["twitter", "instagram", "linkedin", "facebook"].map((social, i) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition-colors"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === "twitter" && (
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      )}
                      {social === "instagram" && (
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                      )}
                      {social === "linkedin" && (
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      )}
                      {social === "facebook" && (
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      )}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-gold-600/5 rounded-3xl blur-xl" />
              
              <div className="relative rounded-3xl border border-gold-500/20 bg-bg-panel/80 backdrop-blur-xl p-8 md:p-10">
                <h3 className="text-2xl font-bold text-foreground mb-6">أرسل رسالتك</h3>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-muted mb-2">الاسم الكامل</label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-bg-deep/50 text-foreground placeholder-muted/50 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all"
                        placeholder="محمد أحمد"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-bg-deep/50 text-foreground placeholder-muted/50 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-muted mb-2">رقم الجوال</label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-bg-deep/50 text-foreground placeholder-muted/50 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all"
                        placeholder="+966 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">الخدمة المطلوبة</label>
                      <select
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-bg-deep/50 text-foreground focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all"
                      >
                        <option value="">اختر الخدمة</option>
                        <option value="tourism">السياحة والسفريات</option>
                        <option value="manpower">خدمة الأيادي العاملة</option>
                        <option value="corporate">حلول الشركات</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-muted mb-2">الرسالة</label>
                    <textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gold-500/20 bg-bg-deep/50 text-foreground placeholder-muted/50 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all resize-none"
                      placeholder="اكتب رسالتك هنا..."
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-bg-deep font-semibold text-lg hover:shadow-xl hover:shadow-gold-500/30 transition-all disabled:opacity-70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full inline-block"
                        />
                        جاري الإرسال...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        تم الإرسال بنجاح!
                      </span>
                    ) : (
                      "إرسال الرسالة"
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                <span className="text-bg-deep font-bold text-xl">Q</span>
              </div>
              <div>
                <p className="text-xl font-bold text-gradient-gold">ALQADI</p>
                <p className="text-sm text-muted">مجموعة القاضي الذهبية</p>
              </div>
            </div>
            <p className="text-muted leading-relaxed max-w-md">
              بوابة ذهبية نحو تجارب سفر راقية وشبكة توظيف موثوقة بمعايير امتياز عالمية.
              نحن نؤمن بأن الفخامة تكمن في التفاصيل.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { href: "#home", label: "الرئيسية" },
                { href: "#services", label: "خدماتنا" },
                { href: "#about", label: "من نحن" },
                { href: "#contact", label: "تواصل معنا" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-muted hover:text-gold-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">خدماتنا</h4>
            <ul className="space-y-3">
              {[
                "السياحة والسفريات",
                "خدمة الأيادي العاملة",
                "الاستشارات المؤسسية",
                "حجوزات الطيران",
              ].map((service) => (
                <li key={service}>
                  <span className="text-muted">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gold-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Golden Al&apos;Qadi Group — جميع الحقوق محفوظة
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted hover:text-gold-400 transition-colors">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-sm text-muted hover:text-gold-400 transition-colors">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main component
export function AlqadiLuxuryExperience() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        <FleetShowcase />
        <ServicesSection />
        <StatsSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
