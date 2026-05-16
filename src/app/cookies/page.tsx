import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCmsData } from "@/lib/cms";
type LegalSection = { title: string; body?: string; bullets?: string[] };
type CompanyInfo = { email?: string };

export const metadata: Metadata = {
  title: "سياسة ملفات الارتباط | مجموعة القاضي الذهبية",
  description: "سياسة استخدام ملفات الارتباط (Cookies) في موقع مجموعة القاضي الذهبية.",
};

export default async function CookiesPage() {
  const cms = await getCmsData("cookies");
  const companySetting = await prisma.siteSetting.findUnique({ where: { key: "company" } });
  const company = (companySetting?.value as CompanyInfo) || {};
  const email = company.email || "info@alqadigroup.com";
  const sections: LegalSection[] = Array.isArray(cms?.sections) ? cms.sections : [];
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gold-500/70">
          <Link href="/" className="transition-colors hover:text-gold-400">الرئيسية</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gold-400">ملفات تعريف الارتباط</span>
        </nav>

        <div className="rounded-3xl border border-gold-500/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gold-400">{cms?.pageTitle || "سياسة ملفات تعريف الارتباط"}</h1>
          <p className="mb-10 text-sm text-gold-500/60">{cms?.lastUpdated || "آخر تحديث: 1 مايو 2026"}</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 leading-loose">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                {section.body ? <p className="text-white/70">{section.body}</p> : null}
                {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                    {section.bullets.map((bullet: string) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}

            <section>
              <h2 className="text-xl font-bold text-white">{cms?.contactTitle || "5. تواصل معنا"}</h2>
              <p className="text-white/70">
                {cms?.contactBody || "لأي استفسارات بخصوص استخدامنا لملفات تعريف الارتباط، تواصل معنا عبر:"}
                <br />
                البريد الإلكتروني: {email}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
