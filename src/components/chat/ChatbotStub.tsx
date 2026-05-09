"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** مساعد نصي — للربط لاحقاً بـ RAG على ملفات PDF معتمدة فقط */
export function ChatbotStub() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 end-4 z-[60] md:bottom-28">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="mb-3 w-[min(100vw-2rem,360px)] rounded-2xl border border-gold-500/30 bg-bg-panel/95 p-4 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-label="مساعد القاضي"
          >
            <p className="text-xs font-semibold text-gold-400">مساعد المجموعة</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              إجابات تجريبية من محتوى الموقع الرسمي. للربط بملفاتكم PDF عبر RAG، أضف
              الخادم والمفاتيح لاحقاً.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <a href="#tourism" className="text-gold-400 underline">
                  سياحة
                </a>
              </li>
              <li>
                <a href="#manpower" className="text-gold-400 underline">
                  توظيف
                </a>
              </li>
              <li>
                <a href="/trust" className="text-gold-400 underline">
                  الشفافية والتراخيص
                </a>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 text-[11px] text-muted underline"
            >
              إغلاق
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-lg font-bold text-bg-deep shadow-lg"
        aria-expanded={open}
        suppressHydrationWarning
      >
        ؟
      </button>
    </div>
  );
}
