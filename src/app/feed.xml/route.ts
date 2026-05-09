import { NextResponse } from "next/server";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alqadigroup.com";

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AlQadi Insights</title>
    <link>${base}/blog</link>
    <description>مدونة مجموعة القاضي الذهبية</description>
    <item>
      <title>اتجاهات السفر الفاخر</title>
      <link>${base}/blog</link>
      <pubDate>Wed, 01 Apr 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  return new NextResponse(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
