import { prisma } from "@/lib/prisma";

/**
 * Fetch CMS data for a specific page key from SiteSetting.
 * Used in server components only.
 */
export async function getCmsData(key: string): Promise<any> {
  try {
    // Prefer CmsPage table (edited via Admin CMS UI).
    // Accept both legacy keys (cms_about) and slugs (about).
    const slug =
      key.startsWith("cms_") ? key.replace(/^cms_/, "") : key;

    const page = await prisma.cmsPage.findUnique({ where: { slug } });
    if (page?.active) return (page.content as any) ?? null;

    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return (setting?.value as any) ?? null;
  } catch {
    return null;
  }
}
