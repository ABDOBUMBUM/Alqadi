"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Calendar, Search, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { TravelBookingModal } from "@/components/forms/TravelBookingModal";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/context/CurrencyContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSiteExperience } from "@/context/SiteExperienceContext";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { colorMode } = useSiteExperience();
  const isLight = colorMode === "light";
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services/visa", label: "التأشيرات" },
    { href: "/services/hotels", label: "الفنادق" },
    { href: "/services/manpower", label: "التوظيف" },
    { href: "/clients", label: "عملاؤنا" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <>
      <TravelBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />

      <header className="fixed left-0 right-0 top-0 z-50 w-full">
        {/* Top Bar */}
        <div className="relative z-50 hidden py-2 backdrop-blur-md md:block" style={{ background: 'var(--nav-topbar-bg)' }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-[11px]" style={{ color: 'var(--page-text-muted)' }}>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-gold-400" />
                مرحباً بكم في مجموعة القاضي للسفريات والسياحة
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gold-400" />
                الكويت
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gold-400" />
                +965 9876 5432
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gold-400" />
                info@alqadigroup.com
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/en" className="hover:text-gold-400 transition-colors">English</Link>
              <span className="text-white/20">|</span>
              {/* Currency Switcher */}
              <div className="relative">
                <button
                  suppressHydrationWarning
                  onClick={() => setCurrencyOpen(o => !o)}
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 hover:border-gold-500/30 hover:text-gold-400 transition-colors"
                >
                  <span className="font-bold text-gold-400">{currency.symbol}</span>
                  <span>{currency.code}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute left-0 top-7 z-50 min-w-[160px] rounded-xl border py-1 shadow-2xl"
                      style={{
                        borderColor: "rgba(201,162,39,0.22)",
                        background: "color-mix(in oklab, var(--page-bg) 90%, black 10%)",
                      }}
                    >
                      {CURRENCIES.map(c => (
                        <li key={c.code}>
                          <button
                            onClick={() => { setCurrency(c.code as CurrencyCode); setCurrencyOpen(false); }}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-xs transition hover:bg-gold-500/10 ${
                              currency.code === c.code ? 'text-gold-300 bg-gold-500/10' : ''
                            }`}
                            style={currency.code === c.code ? undefined : { color: "var(--page-text-muted)" }}
                          >
                            <span className="w-6 font-bold text-gold-400">{c.symbol}</span>
                            <span>{c.nameAr}</span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="border-b py-3 backdrop-blur-lg" style={{ background: 'var(--nav-bg)', borderColor: 'var(--page-border-subtle)' }}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex flex-col items-center">
                <Image
                  src="/brand/alqadi-logo.png"
                  alt="مجموعة القاضي الذهبية للسفريات والسياحة"
                  width={100}
                  height={40}
                  className="h-auto w-20"
                  priority
                />
                <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-gold-400">
                  <Sparkles className="h-3 w-3" />
                  مجموعة القاضي الذهبية
                </span>
              </Link>

              <nav className="hidden items-center gap-6 lg:flex">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* ← الزر الرئيسي يفتح الـ Modal */}
              <button
                onClick={() => setBookingOpen(true)}
                suppressHydrationWarning
                className="hidden sm:flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2 text-xs font-bold text-black transition-all hover:bg-gold-400 active:scale-95"
              >
                <Calendar className="h-3.5 w-3.5" />
                احجز رحلتك الآن
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-gold-400 transition hover:bg-gold-500/10"
                style={{ background: 'var(--page-surface)' }}
                suppressHydrationWarning
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gold-400 lg:hidden"
                style={{ background: 'var(--page-surface)' }}
                aria-label="فتح القائمة"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gold-500/20 px-6 py-5 backdrop-blur-xl lg:hidden"
            style={{ background: 'var(--mobile-menu-bg)' }}
          >
            <nav className="grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    isActive(item.href)
                      ? "bg-gold-500/15 text-gold-500"
                      : "hover:bg-gold-500/10 hover:text-gold-500"
                  }`}
                  style={{ color: !isActive(item.href) ? 'var(--page-text-muted)' : undefined }}
                >
                  {item.label}
                </Link>
              ))}
              {/* زر الحجز في الموبايل */}
              <button
                onClick={() => { setMobileOpen(false); setBookingOpen(true); }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-sm font-bold text-black"
              >
                <Calendar className="h-4 w-4" />
                احجز رحلتك الآن
              </button>
              {/* Theme toggle in mobile menu */}
              <div className="flex items-center justify-between rounded-xl border border-gold-500/15 px-4 py-3" style={{ background: 'var(--page-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--page-text-muted)' }}>وضع العرض</span>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </header>
    </>
  );
}

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors hover:text-gold-500 ${
        active ? "text-gold-500" : ""
      }`}
      style={!active ? { color: 'var(--page-text-muted)' } : undefined}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute -bottom-1 left-0 h-0.5 w-full bg-gold-500"
        />
      )}
    </Link>
  );
}
