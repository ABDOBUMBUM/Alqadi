"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ServiceRecommender() {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);

  const result =
    q1 === "family" && q2 === "abroad"
      ? "travel"
      : q1 === "work" && q2 === "contract"
        ? "manpower"
        : q1 && q2
          ? "both"
          : null;

  return (
    <GlassPanelSimple>
      <h3 className="text-lg font-semibold text-gold-400">توصية خدمة</h3>
      <p className="mt-2 text-sm text-muted">
        جاوب عن سؤالين لنقترح المسار الأنسب.
      </p>
      <div className="mt-4 space-y-3">
        <p className="text-sm font-medium text-foreground">ما هدفك الأساسي؟</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["family", "سفر عائلي فاخر"],
            ["work", "فرصة عمل / عقد"],
            ["corp", "برامج شركات"],
          ].map(([id, label]) => (
            <button suppressHydrationWarning
              key={id}
              type="button"
              onClick={() => setQ1(id)}
              className={`rounded-full px-4 py-2 text-xs ${
                q1 === id
                  ? "bg-gold-500 text-bg-deep"
                  : "border border-gold-500/30 text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-foreground">أين تركز؟</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["abroad", "وجهات دولية"],
            ["local", "داخلية"],
            ["contract", "عقود وتوظيف"],
          ].map(([id, label]) => (
            <button suppressHydrationWarning
              key={id}
              type="button"
              onClick={() => setQ2(id)}
              className={`rounded-full px-4 py-2 text-xs ${
                q2 === id
                  ? "bg-gold-500 text-bg-deep"
                  : "border border-gold-500/30 text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-gold-500/25 bg-bg-deep/70 p-4 text-sm text-muted"
          >
            {result === "travel" ? (
              <>
                ننصح بمسار{" "}
                <a href="#tourism" className="text-gold-400 underline">
                  السياحة والسفريات
                </a>
                .
              </>
            ) : result === "manpower" ? (
              <>
                ننصح بمسار{" "}
                <a href="#manpower" className="text-gold-400 underline">
                  خدمة الأيادي العاملة
                </a>
                .
              </>
            ) : (
              <>يمكن الجمع بين الفريقين — تواصل معنا لخطة مخصصة.</>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GlassPanelSimple>
  );
}

function GlassPanelSimple({ children }: { children: ReactNode }) {
  return (
    <div className="gold-border rounded-3xl border border-gold-500/20 bg-bg-panel/50 p-6 backdrop-blur-xl">
      {children}
    </div>
  );
}
