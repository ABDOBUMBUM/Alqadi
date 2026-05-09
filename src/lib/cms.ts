import { prisma } from "@/lib/prisma";

/**
 * Fetch CMS data for a specific page key from SiteSetting.
 * Used in server components only.
 */
export async function getCmsData(key: string): Promise<any> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return (setting?.value as any) ?? null;
  } catch {
    return null;
  }
}
