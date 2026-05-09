import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["company", "stats", "destinations", "packages", "jobs", "branches", "pricing",
               "cms_about", "cms_contact", "cms_blog", "cms_faq", "cms_clients", "cms_vip", "cms_home", "cms_travel"],
        },
      },
    });

    const dbContent: Record<string, any> = {};

    settings.forEach((s) => {
      dbContent[s.key] = s.value;
    });

    return NextResponse.json({
      company: dbContent.company || {
        nameAr: "مجموعة القاضي الذهبية",
        nameEn: "Golden Al'Qadi Group",
        phone: "+96598765432",
        email: "info@alqadigroup.com",
        address: "الكويت",
        whatsapp: "96598765432",
        foundedYear: "1980",
        taglineAr: "السفريات والسياحة",
        taglineEn: "Travel & Tourism",
      },
      stats: dbContent.stats || {
        clients: "860,000+",
        experience: "45+",
        countries: "75+",
        satisfaction: "98%",
      },
      destinations: dbContent.destinations || [],
      packages: dbContent.packages || [],
      jobs: dbContent.jobs || [],
      branches: dbContent.branches || [],
      pricing: dbContent.pricing || [],
      // CMS Pages
      cms_about: dbContent.cms_about || null,
      cms_contact: dbContent.cms_contact || null,
      cms_blog: dbContent.cms_blog || null,
      cms_faq: dbContent.cms_faq || null,
      cms_clients: dbContent.cms_clients || null,
      cms_vip: dbContent.cms_vip || null,
      cms_home: dbContent.cms_home || null,
      cms_travel: dbContent.cms_travel || null,
    });
  } catch (error) {
    console.error("Content GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
