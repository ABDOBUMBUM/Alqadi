import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alqadigroup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "daily" },
    { path: "/en", priority: 0.9, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/clients", priority: 0.7, freq: "monthly" },
    { path: "/services/travel", priority: 0.9, freq: "weekly" },
    { path: "/services/hotels", priority: 0.9, freq: "weekly" },
    { path: "/services/visa", priority: 0.9, freq: "weekly" },
    { path: "/services/manpower", priority: 0.8, freq: "weekly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/blog", priority: 0.5, freq: "weekly" },
    { path: "/vip", priority: 0.4, freq: "monthly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/cookies", priority: 0.2, freq: "yearly" },
    { path: "/trust", priority: 0.3, freq: "monthly" },
  ];
  return paths.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
