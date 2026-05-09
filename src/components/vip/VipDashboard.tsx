"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";

export function VipDashboard() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <GlassPanel hoverGlow>
        <h2 className="text-lg font-semibold text-gold-400">حالة الطلب</h2>
        <p className="mt-2 text-sm text-muted">قيد المراجعة — تحديث تلقائي عند الربط.</p>
        <p className="mt-4 text-xs text-muted/70">REF: VIP-2026-0418</p>
      </GlassPanel>
      <GlassPanel hoverGlow>
        <h2 className="text-lg font-semibold text-gold-400">المواعيد القادمة</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>استشارة سفر — قريباً</li>
          <li>مكالمة متابعة — قريباً</li>
        </ul>
      </GlassPanel>
      <GlassPanel className="md:col-span-2" hoverGlow>
        <h2 className="text-lg font-semibold text-gold-400">روابط سريعة</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/services/travel"
            className="rounded-full border border-gold-500/40 px-4 py-2 text-xs text-foreground"
          >
            خدمات السفر
          </a>
          <a
            href="/services/manpower"
            className="rounded-full border border-gold-500/40 px-4 py-2 text-xs text-foreground"
          >
            التوظيف
          </a>
          <a
            href="mailto:vip@alqadigroup.com"
            className="rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-bg-deep"
          >
            بريد VIP
          </a>
        </div>
      </GlassPanel>
    </div>
  );
}
