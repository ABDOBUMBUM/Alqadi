"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone, Mail, MapPin, Globe2, MessageCircle,
  Plane, Hotel, Users, Briefcase, ChevronUp,
} from "lucide-react";

const footerSections = [
  {
    title: "خدماتنا",
    links: [
      { href: "/services/travel", label: "السفريات والسياحة", icon: Plane },
      { href: "/services/hotels", label: "حجوزات الفنادق", icon: Hotel },
      { href: "/services/visa", label: "خدمات التأشيرات", icon: Globe2 },
      { href: "/services/manpower", label: "الأيادي العاملة", icon: Users },
    ],
  },
  {
    title: "الشركة",
    links: [
      { href: "/about", label: "من نحن" },
      { href: "/clients", label: "عملاؤنا" },
      { href: "/faq", label: "الأسئلة الشائعة" },
      { href: "/blog", label: "المدونة" },
      { href: "/vip", label: "عملاء VIP" },
    ],
  },
  {
    title: "قانوني",
    links: [
      { href: "/privacy", label: "سياسة الخصوصية" },
      { href: "/cookies", label: "ملفات الارتباط" },
      { href: "/trust", label: "الشفافية والتراخيص" },
    ],
  },
];

export function SiteFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative border-t"
      style={{
        background: "var(--footer-bg, var(--page-bg))",
        borderColor: "rgba(201,162,39,0.15)",
        color: "var(--page-text-muted)",
      }}
    >
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/alqadi-logo.png"
                alt="مجموعة القاضي الذهبية"
                width={120}
                height={48}
                className="h-auto w-28"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
              مجموعة القاضي الذهبية — أكثر من 45 عاماً من التميز في خدمات السفريات والسياحة والأيادي العاملة.
              نخدم أكثر من 860,000 عميل في أكثر من 75 دولة حول العالم.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "96598765432"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition-colors hover:text-gold-400"
              >
                <MessageCircle className="h-4 w-4 text-gold-400" />
                واتساب: {process.env.NEXT_PUBLIC_PHONE_NUMBER || "+965 9876 5432"}
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || "+96598765432"}`}
                className="flex items-center gap-3 text-sm transition-colors hover:text-gold-400"
              >
                <Phone className="h-4 w-4 text-gold-400" />
                {process.env.NEXT_PUBLIC_PHONE_NUMBER || "+965 9876 5432"}
              </a>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "info@alqadigroup.com"}`}
                className="flex items-center gap-3 text-sm transition-colors hover:text-gold-400"
              >
                <Mail className="h-4 w-4 text-gold-400" />
                {process.env.NEXT_PUBLIC_EMAIL || "info@alqadigroup.com"}
              </a>
              <p className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gold-400" />
                الكويت — مجمع القاضي، شارع الخليج العربي
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-bold" style={{ color: "var(--page-text)" }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm transition-colors hover:text-gold-400"
                    >
                      {"icon" in link && link.icon && <link.icon className="h-3.5 w-3.5 text-gold-500/50" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs" style={{ color: "var(--page-text-dim, var(--page-text-muted))" }}>
            © {new Date().getFullYear()} مجموعة القاضي الذهبية للسفريات والسياحة. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-4">
            {/* Social links — update hrefs with real accounts */}
            {[
              { label: "IG", href: "#", ariaLabel: "Instagram" },
              { label: "FB", href: "#", ariaLabel: "Facebook" },
              { label: "X", href: "#", ariaLabel: "X / Twitter" },
            ].map((social) => (
              <a
                key={social.ariaLabel}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/20 text-xs font-bold transition-all hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-400"
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Scroll to top */}
          <button
            suppressHydrationWarning
            onClick={scrollToTop}
            aria-label="العودة للأعلى"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/20 transition-all hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-400"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
