import type { Metadata } from "next";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";
import { BookOpen, Calendar, ArrowLeft, Rss } from "lucide-react";

export const metadata: Metadata = {
  title: "المدونة والأخبار | مجموعة القاضي الذهبية",
  description: "آخر أخبار ومقالات مجموعة القاضي الذهبية في مجال السياحة والسفر والخدمات.",
};

export const revalidate = 3600;

const defaultPosts = [
  {
    slug: "umrah-2025",
    title: "دليلك الشامل لرحلة العمرة 2025",
    date: "مارس 2025",
    excerpt: "كل ما تحتاجه لرحلة عمرة مميزة — من الوثائق حتى الإقامة.",
    category: "العمرة",
  },
  {
    slug: "turkey-destinations",
    title: "أفضل 10 وجهات في تركيا لصيف 2025",
    date: "فبراير 2025",
    excerpt: "اكتشف أجمل المناطق السياحية في تركيا التي ترشحها مجموعة القاضي.",
    category: "السياحة",
  },
  {
    slug: "visa-guide-europe",
    title: "كل ما تعرفه عن تأشيرات أوروبا شنغن",
    date: "يناير 2025",
    excerpt: "شرح تفصيلي لإجراءات التأشيرة الأوروبية وأسرار القبول السريع.",
    category: "التأشيرات",
  },
];

export default async function BlogPage() {
  const cms = await getCmsData("cms_blog");
  const posts = Array.isArray(cms?.posts) && cms.posts.length > 0 ? cms.posts : defaultPosts;
  const title = cms?.title ?? "المدونة والأخبار";
  const subtitle = cms?.subtitle ?? "مقالات ونصائح من خبراء مجموعة القاضي الذهبية في السياحة والسفر";

  return (
    <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,162,39,0.10) 0%, transparent 60%)" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-xs tracking-[0.4em] text-gold-400 flex items-center justify-center gap-2">
            <Rss className="h-3 w-3" /> BLOG & INSIGHTS
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl" style={{ color: "var(--page-text)" }}>
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {posts.length === 0 ? (
          <div className="py-24 text-center" style={{ color: "var(--page-text-muted)" }}>
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gold-400/40" />
            <p className="text-lg">لا توجد مقالات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any, i: number) => (
              <article
                key={post.slug || i}
                className="gold-glow-card group rounded-3xl border border-gold-500/15 p-6 transition hover:border-gold-500/30"
                style={{ background: "var(--page-surface)" }}
              >
                {post.category && (
                  <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-bold text-gold-300 mb-4">
                    {post.category}
                  </span>
                )}
                <h2 className="text-lg font-bold leading-snug group-hover:text-gold-300 transition-colors" style={{ color: "var(--page-text)" }}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 text-sm leading-relaxed line-clamp-3" style={{ color: "var(--page-text-muted)" }}>
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--page-border-subtle)" }}>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--page-text-dim, var(--page-text-muted))" }}>
                    <Calendar className="h-3 w-3 text-gold-400/60" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gold-400 font-medium group-hover:gap-2 transition-all">
                    اقرأ المزيد <ArrowLeft className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Back Home */}
      <section className="pb-20 text-center">
        <Link href="/" className="btn-ghost-gold gap-2 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          العودة للرئيسية
        </Link>
      </section>
    </div>
  );
}

