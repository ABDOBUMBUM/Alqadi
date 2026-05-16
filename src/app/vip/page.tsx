import type { Metadata } from "next";
import Link from "next/link";
import { VipDashboard } from "@/components/vip/VipDashboard";
import { getCmsData } from "@/lib/cms";
import { Star, ArrowLeft, Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "بوابة VIP | مجموعة القاضي الذهبية",
  description: "لوحة العملاء المميزين — تتبع حالة الطلبات والحجوزات والمواعيد الخاصة.",
};

export const revalidate = 3600;

export default async function VipPage() {
  const cms = await getCmsData("cms_vip");
  const title = cms?.title ?? "بوابة العملاء المميزين";
  const subtitle = cms?.subtitle ?? "مرحباً بك في المنطقة الحصرية لعملاء مجموعة القاضي الذهبية";

  return (
    <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.12) 0%, transparent 60%)" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10">
            <Crown className="h-10 w-10 text-gold-400" />
          </div>
          <p className="text-xs tracking-[0.4em] text-gold-400 flex items-center justify-center gap-2">
            <Star className="h-3 w-3 fill-gold-400" /> VIP EXCLUSIVE
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl" style={{ color: "var(--page-text)" }}>
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* VIP Dashboard */}
      <section className="mx-auto max-w-5xl px-6 py-6 md:px-10 pb-20">
        <VipDashboard />
      </section>

      {/* Back Link */}
      <div className="pb-20 text-center">
        <Link href="/" className="btn-ghost-gold gap-2 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

