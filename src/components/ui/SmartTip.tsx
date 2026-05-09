"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** تلميح سياقي — استبدل أيقونة lucide إذا لم تُثبَّت: نستخدم SVG مدمج */
export function SmartTip({ children }: Props) {
  return (
    <div
      className="mt-4 flex items-start gap-2 rounded-2xl border border-gold-500/20 bg-bg-deep/60 px-4 py-3 text-xs leading-relaxed text-muted"
      role="note"
    >
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
        <InfoIcon />
      </span>
      <span>{children}</span>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}
