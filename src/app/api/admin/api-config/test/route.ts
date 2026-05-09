import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SETTING_KEY = "api_integrations";

// Tests an API by making a real HTTP request to its endpoint
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    const list: any[] = Array.isArray(setting?.value) ? (setting!.value as any[]) : [];
    const api = list.find((a: any) => a.id === id);
    if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });

    if (!api.endpoint) {
      return NextResponse.json({ ok: false, message: "لم يتم تحديد Endpoint لهذه الخدمة" });
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (api.apiKey) headers["Authorization"] = `Bearer ${api.apiKey}`;
    if (api.apiKey) headers["X-API-Key"] = api.apiKey;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(api.endpoint, { method: "GET", headers, signal: controller.signal });
      clearTimeout(timeout);
      const ok = res.status < 500;
      return NextResponse.json({
        ok,
        status: res.status,
        message: ok
          ? `✅ الاتصال ناجح — الخادم رد بـ HTTP ${res.status}`
          : `⚠️ الخادم رد بخطأ HTTP ${res.status}`,
      });
    } catch (err: any) {
      clearTimeout(timeout);
      const isTimeout = err?.name === "AbortError";
      return NextResponse.json({
        ok: false,
        message: isTimeout
          ? "⏱️ انتهت المهلة — الخادم لم يستجب خلال 8 ثوانٍ"
          : `❌ فشل الاتصال: ${err?.message ?? "خطأ غير معروف"}`,
      });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, message: "خطأ في خادم الاختبار" }, { status: 500 });
  }
}
