import type { Metadata } from "next";
import Link from "next/link";
import { ASSET_AUDIT } from "@/lib/three-asset-notes";
import { getCmsData } from "@/lib/cms";

export const metadata: Metadata = {
  title: "الشفافية والتراخيص | مجموعة القاضي الذهبية",
};

export const revalidate = 86400;

export default async function TrustPage() {
  const cms = await getCmsData("trust") || {};

  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <Link href="/" className="text-sm text-gold-400 underline">
        ← الرئيسية
      </Link>
      <h1 className="mt-6 text-3xl font-bold">{cms?.pageTitle || "مركز الشفافية"}</h1>
      <p className="mt-4 text-muted">
        {cms?.pageSubtitle || "سياسات، تراخيص، وشهادات — حدّث التواريخ والأرقام من مصدركم الرسمي."}
      </p>
      <section className="mt-10 space-y-6 rounded-2xl border border-gold-500/20 bg-bg-panel/50 p-6">
        <h2 className="text-lg font-semibold text-gold-400">{cms?.sectionTitle || "سجل أصول ثلاثية الأبعاد"}</h2>
        <ul className="space-y-4 text-sm text-muted">
          {ASSET_AUDIT.map((a) => (
            <li key={a.id} className="border-b border-gold-500/10 pb-4 last:border-0">
              <strong className="text-foreground">{a.id}</strong> — {a.source} —{" "}
              {a.license} — <span className="text-xs">تحديث {a.updated}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
