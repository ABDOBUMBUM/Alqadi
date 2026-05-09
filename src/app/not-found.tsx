"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, Home, MessageCircle, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center marble-bg"
      style={{ color: "var(--page-text)" }}
    >
      {/* Animated Plane */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Plane className="h-20 w-20 text-gold-400 rotate-[-30deg]" />
          </motion.div>
          {/* Trail dots */}
          <div className="absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gold-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* 404 Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs tracking-[0.4em] text-gold-400">ERROR 404</p>
        <h1 className="mt-4 text-7xl font-black md:text-9xl">
          <span className="text-gold-gradient">404</span>
        </h1>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--page-text)" }}>
          الصفحة غير موجودة
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
          يبدو أن هذه الرحلة لم تجد وجهتها! الصفحة التي تبحث عنها قد تكون نُقلت أو حُذفت.
          دعنا نساعدك للعودة إلى المسار الصحيح.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <Link href="/" className="btn-gold gap-2">
          <Home className="h-4 w-4" />
          العودة للرئيسية
        </Link>
        <Link href="/contact" className="btn-ghost-gold gap-2">
          <MessageCircle className="h-4 w-4" />
          تواصل معنا
        </Link>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        {[
          { href: "/services/travel", label: "السفريات" },
          { href: "/services/hotels", label: "الفنادق" },
          { href: "/services/visa", label: "التأشيرات" },
          { href: "/faq", label: "الأسئلة الشائعة" },
          { href: "/about", label: "من نحن" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-gold-500/20 px-4 py-2 text-xs transition hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-400"
            style={{ color: "var(--page-text-muted)" }}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
