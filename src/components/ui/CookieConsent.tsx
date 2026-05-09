"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const KEY = "alqadi_cookie_consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-xl rounded-2xl border border-gold-500/30 bg-bg-panel/95 p-5 shadow-2xl backdrop-blur-xl md:left-auto md:right-6"
        >
          <h2 id="cookie-title" className="text-sm font-semibold text-foreground">
            ملفات تعريف الارتباط والقياس
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            نستخدم بيانات أساسية لتحسين الأداء والتجربة.             يمكنك قراءة{" "}
            <Link href="/privacy" className="text-gold-400 underline">
              سياسة الخصوصية
            </Link>{" "}
            و{" "}
            <Link href="/cookies" className="text-gold-400 underline">
              ملفات الارتباط
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button suppressHydrationWarning
              type="button"
              onClick={accept}
              className="rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-bg-deep"
            >
              موافقة
            </button>
            <button suppressHydrationWarning
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gold-500/40 px-4 py-2 text-xs text-foreground"
            >
              لاحقاً
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
