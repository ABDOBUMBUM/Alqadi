import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, DollarSign, Briefcase, Calendar, Building2, CheckCircle2, MessageCircle, ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ jobId: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params;
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { title: "وظيفة غير موجودة" };
  return {
    title: `${job.title} — مجموعة القاضي | مجموعة القاضي`,
    description: job.description || "",
    alternates: { canonical: `/services/manpower/${job.id}` },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params;
  const dbJob = await prisma.job.findUnique({ where: { id: jobId } });
  const companySetting = await prisma.siteSetting.findUnique({ where: { key: "company" } });
  const waPhone = String((companySetting?.value as any)?.whatsapp || "96598765432");
  const job: any = dbJob
    ? {
        id: dbJob.id,
        title: dbJob.title,
        company: "مجموعة القاضي للتوظيف",
        location: dbJob.country,
        salary: `${dbJob.salary} ${dbJob.currency}`,
        type: "دوام كامل",
        category: dbJob.category,
        posted: "متاح للتقديم",
        urgent: false,
        desc: dbJob.description || "",
        requirements: Array.isArray(dbJob.requirements) ? dbJob.requirements : [],
      }
    : null;

  if (!job) notFound();

  // JobPosting JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.desc,
    identifier: { "@type": "PropertyValue", name: job.company, value: job.id },
    datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: "https://alqadigroup.com",
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "KWD",
      value: { "@type": "QuantitativeValue", unitText: "MONTH" },
    },
    applicantLocationRequirements: { "@type": "Country", name: "KW" },
  };

  const waLink = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(
    `مرحباً، أود التقدم لوظيفة: ${job.title} في ${job.company}`
  )}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative min-h-screen bg-black pt-28">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link href="/services/manpower" className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300">
            <ChevronLeft className="h-4 w-4" />
            العودة للوظائف
          </Link>

          {/* Header */}
          <div className="mt-8 rounded-3xl border border-gold-500/20 bg-white/[0.03] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {job.urgent && (
                  <span className="mb-3 inline-block rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400">
                    🔴 مطلوب بشكل عاجل
                  </span>
                )}
                <h1 className="text-3xl font-black text-white">{job.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-gold-400">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </p>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold gap-2">
                <MessageCircle className="h-4 w-4" />
                تقدّم الآن
              </a>
            </div>

            {/* Meta info */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-white/8 pt-6">
              {[
                { icon: MapPin, label: job.location },
                { icon: DollarSign, label: job.salary },
                { icon: Briefcase, label: job.type },
                { icon: Calendar, label: `نُشرت ${job.posted}` },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60">
                  <Icon className="h-4 w-4 text-gold-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-3xl border border-gold-500/15 bg-white/[0.02] p-8">
            <h2 className="text-xl font-bold text-white">وصف الوظيفة</h2>
            <p className="mt-4 leading-relaxed text-white/65">{job.desc}</p>
          </div>

          {/* Requirements */}
          <div className="mt-6 rounded-3xl border border-gold-500/15 bg-white/[0.02] p-8">
            <h2 className="text-xl font-bold text-white">المتطلبات</h2>
            <ul className="mt-4 space-y-3">
              {job.requirements.map((req: string) => (
                <li key={req} className="flex items-center gap-3 text-white/65">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply CTA */}
          <div className="mt-8 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-8 text-center">
            <h2 className="text-xl font-bold text-white">مهتم بهذه الوظيفة؟</h2>
            <p className="mt-2 text-sm text-white/55">أرسل سيرتك الذاتية عبر واتساب وسيتواصل معك فريقنا خلال 24 ساعة.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold gap-2">
                <MessageCircle className="h-4 w-4" />
                تقدّم عبر واتساب
              </a>
              <Link href="/services/manpower" className="btn-ghost-gold gap-2">
                <ChevronLeft className="h-4 w-4" />
                وظائف أخرى
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
