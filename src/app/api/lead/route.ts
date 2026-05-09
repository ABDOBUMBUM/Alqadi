import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_FILE = 4 * 1024 * 1024;

export async function POST(req: Request) {
  // Rate limit: 5 leads per IP per hour to prevent spam
  const ip = getClientIp(req);
  const limit = rateLimit(`lead:${ip}`, 5, 60 * 60_000); 
  
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: "rate_limit_exceeded", message: "تم تجاوز الحد الأقصى لإرسال الطلبات. يرجى المحاولة لاحقاً." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const ct = req.headers.get("content-type") ?? "";
    let name = "";
    let email = "";
    let phone = "";
    let service = "";
    let message = "";

    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      name = String(fd.get("name") ?? "");
      email = String(fd.get("email") ?? "");
      phone = String(fd.get("phone") ?? "");
      service = String(fd.get("service") ?? "");
      message = String(fd.get("message") ?? "");
      const file = fd.get("file");
      if (file && file instanceof File && file.size > 0) {
        if (file.size > MAX_FILE) {
          return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 400 });
        }
        const allowed = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowed.includes(file.type)) {
          return NextResponse.json({ ok: false, error: "bad_file_type" }, { status: 400 });
        }
      }
    } else {
      const j = (await req.json()) as Record<string, unknown>;
      name = String(j.name ?? "");
      email = String(j.email ?? "");
      phone = String(j.phone ?? "");
      service = String(j.service ?? "");
      message = String(j.message ?? "");
    }

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    // Save to Database
    await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
        source: "website",
      },
    });

    // Send to external CRM if webhook is configured
    const webhook = process.env.CRM_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message,
          source: "alqadi-web",
        }),
      }).catch((e) => {
        console.error("Webhook failed:", e);
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
