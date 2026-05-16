import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Legacy content store (SiteSetting) — keep as fallback.
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "company",
            "stats",
            "destinations",
            "packages",
            "jobs",
            "branches",
            "pricing",
            "cms_about",
            "cms_contact",
            "cms_blog",
            "cms_faq",
            "cms_clients",
            "cms_vip",
            "cms_home",
            "cms_travel",
            "cms_hotels",
            "cms_visa",
            "cms_manpower",
            "cms_en",
            "cms_trust",
            "cms_privacy",
            "cms_cookies",
          ],
        },
      },
    });

    const dbContent: Record<string, any> = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    // Canonical data sources (tables) — used by Admin UI.
    const [destinationsDb, packagesDb, branchesDb, pricingDb, cmsPagesDb] = await Promise.all([
      prisma.destination.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
      prisma.package.findMany({
        where: { active: true },
        include: { destination: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.branch.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
      prisma.pricing.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
      prisma.cmsPage.findMany({ where: { active: true }, orderBy: { updatedAt: "desc" } }),
    ]);

    const cmsBySlug = Object.fromEntries(cmsPagesDb.map((p) => [p.slug, p.content]));
    const cmsFallback = {
      cms_about: dbContent.cms_about ?? null,
      cms_contact: dbContent.cms_contact ?? null,
      cms_blog: dbContent.cms_blog ?? null,
      cms_faq: dbContent.cms_faq ?? null,
      cms_clients: dbContent.cms_clients ?? null,
      cms_vip: dbContent.cms_vip ?? null,
      cms_home: dbContent.cms_home ?? null,
      cms_travel: dbContent.cms_travel ?? null,
      cms_hotels: dbContent.cms_hotels ?? null,
      cms_visa: dbContent.cms_visa ?? null,
      cms_manpower: dbContent.cms_manpower ?? null,
      cms_en: dbContent.cms_en ?? null,
      cms_trust: dbContent.cms_trust ?? null,
      cms_privacy: dbContent.cms_privacy ?? null,
      cms_cookies: dbContent.cms_cookies ?? null,
    };

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
      // Prefer canonical DB tables; fallback to legacy SiteSetting payloads if tables are empty.
      destinations:
        destinationsDb.length > 0
          ? destinationsDb.map((d) => ({
              id: d.id,
              name: `${d.name}، ${d.country}`,
              img: d.imageUrl,
              lat: d.lat,
              lng: d.lng,
              active: d.active,
              featured: d.featured,
              priceKWD: d.priceKWD,
              description: d.description,
              rating: d.rating,
            }))
          : dbContent.destinations || [],
      packages:
        packagesDb.length > 0
          ? packagesDb.map((p) => ({
              id: p.id,
              title: p.title,
              nights: p.nights,
              days: p.days,
              price: p.price,
              currency: p.currency,
              discount: p.discount,
              includes: p.includes,
              imageUrl: p.imageUrl,
              active: p.active,
              destination: p.destination
                ? { id: p.destination.id, name: p.destination.name, country: p.destination.country }
                : null,
              // UI legacy hint
              isHot: Boolean(p.discount && String(p.discount).trim().length > 0),
            }))
          : dbContent.packages || [],
      branches: branchesDb.length > 0 ? branchesDb : dbContent.branches || [],
      pricing: pricingDb.length > 0 ? pricingDb : dbContent.pricing || [],
      jobs: dbContent.jobs || [],

      // CMS Pages: prefer CmsPage table (edited in Admin) and fallback to legacy SiteSetting keys
      cms_about: cmsBySlug.about ?? cmsFallback.cms_about,
      cms_contact: cmsBySlug.contact ?? cmsFallback.cms_contact,
      cms_blog: cmsBySlug.blog ?? cmsFallback.cms_blog,
      cms_faq: cmsBySlug.faq ?? cmsFallback.cms_faq,
      cms_clients: cmsBySlug.clients ?? cmsFallback.cms_clients,
      cms_vip: cmsBySlug.vip ?? cmsFallback.cms_vip,
      cms_home: cmsBySlug.home ?? cmsFallback.cms_home,
      cms_travel: cmsBySlug.travel ?? cmsFallback.cms_travel,
      cms_hotels: cmsBySlug.hotels ?? cmsFallback.cms_hotels,
      cms_visa: cmsBySlug.visa ?? cmsFallback.cms_visa,
      cms_manpower: cmsBySlug.manpower ?? cmsFallback.cms_manpower,
      cms_en: cmsBySlug.en_home ?? cmsFallback.cms_en,
      cms_trust: cmsBySlug.trust ?? cmsFallback.cms_trust,
      cms_privacy: cmsBySlug.privacy ?? cmsFallback.cms_privacy,
      cms_cookies: cmsBySlug.cookies ?? cmsFallback.cms_cookies,
    });
  } catch (error) {
    console.error("Content GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
