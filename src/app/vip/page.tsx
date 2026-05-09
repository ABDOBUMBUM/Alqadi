import type { Metadata } from "next";
import Link from "next/link";
import { VipDashboard } from "@/components/vip/VipDashboard";

export const metadata: Metadata = {
  title: "بوابة VIP | مجموعة القاضي الذهبية",
  description: "لوحة مختصرة للعملاء المميزين — حالة الطلبات والمواعيد.",
};

export const revalidate = 3600;

export default function VipPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-24">
      <Link href="/" className="text-sm text-gold-400 underline">
        ← العودة للرئيسية
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-foreground">VIP Concierge</h1>
      <p className="mt-2 text-muted">
        واجهة مختصرة — اربط لاحقاً بـ CRM أو لوحة داخلية لعرض حالة حقيقية.
      </p>
      <VipDashboard />
    </div>
  );
}
