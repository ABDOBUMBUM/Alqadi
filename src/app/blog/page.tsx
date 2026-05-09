import type { Metadata } from "next";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Insights | مجموعة القاضي الذهبية",
};

export const revalidate = 3600;

const posts = [
  { slug: "luxury-travel-trends", title: "اتجاهات السفر الفاخر", date: "2026-04-01" },
];

export default async function BlogPage() {
  const cms = await getCmsData("cms_blog");
  const _posts = cms?.posts ?? posts;
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <Link href="/" className="text-sm text-gold-400 underline">
        ← الرئيسية
      </Link>
      <h1 className="mt-6 text-3xl font-bold">مدونة Insights</h1>
      <p className="mt-2 text-muted">فهرسة وRSS — اربط بـ CMS لاحقاً.</p>
      <ul className="mt-10 space-y-4">
        {_posts.map((p: any) => (
          <li key={p.slug} className="rounded-xl border border-gold-500/15 p-4">
            <span className="text-xs text-muted">{p.date}</span>
            <h2 className="text-lg font-semibold text-foreground">{p.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
