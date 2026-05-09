import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  // Rate limit: 30 requests per minute per IP
  const ip = getClientIp(request);
  const limit = rateLimit(`visas:${ip}`, 30, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "تم تجاوز الحد الأقصى للطلبات. حاول بعد قليل." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const visas = await prisma.visa.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { country: "asc" },
    });

    if (isAdmin) {
      return NextResponse.json(visas);
    }

    // تحويل البيانات من الداتا بيز لشكل يناسب الواجهة القديمة
    // يمكن لاحقاً تحديث الواجهة لتقرأ البيانات كما هي
    const formattedVisas = visas.map((visa) => ({
      id: visa.id,
      country: visa.country,
      flag: getFlagEmoji(visa.countryEn || visa.country), // Helper function for flags
      types: [
        { 
          label: visa.type === 'tourism' ? 'سياحية' : visa.type === 'business' ? 'عمل' : visa.type, 
          duration: `${visa.processingDays} أيام عمل`, 
          color: "text-gold-400", 
          bg: "bg-gold-500/10 border-gold-500/20" 
        },
      ],
      description: visa.description,
      price: visa.price,
      requirements: visa.requirements,
    }));

    // تجميع التأشيرات حسب الدولة إذا كانت هناك أكثر من تأشيرة لنفس الدولة
    const groupedVisas = formattedVisas.reduce((acc, current) => {
      const existing = acc.find((item) => item.country === current.country);
      if (existing) {
        existing.types.push(...current.types);
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as any[]);

    return NextResponse.json(groupedVisas, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    console.error("Visas API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات التأشيرات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const visa = await prisma.visa.create({
      data: {
        country: data.country,
        countryEn: data.countryEn,
        type: data.type || "tourism",
        price: data.price || 0,
        currency: data.currency || "KWD",
        processingDays: data.processingDays || 7,
        requirements: data.requirements || [],
        documents: data.documents || [],
        description: data.description,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(visa);
  } catch (error) {
    console.error("Visas POST error:", error);
    return NextResponse.json({ error: "فشل في إضافة التأشيرة" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) return NextResponse.json({ error: "معرف التأشيرة مطلوب" }, { status: 400 });

    const visa = await prisma.visa.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(visa);
  } catch (error) {
    console.error("Visas PUT error:", error);
    return NextResponse.json({ error: "فشل في تحديث التأشيرة" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "معرف التأشيرة مطلوب" }, { status: 400 });

    await prisma.visa.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visas DELETE error:", error);
    return NextResponse.json({ error: "فشل في حذف التأشيرة" }, { status: 500 });
  }
}

function getFlagEmoji(countryName: string): string {
  const flags: Record<string, string> = {
    "Turkey": "🇹🇷",
    "Egypt": "🇪🇬",
    "Malaysia": "🇲🇾",
    "Azerbaijan": "🇦🇿",
    "Georgia": "🇬🇪",
    "United Kingdom": "🇬🇧",
    "Jordan": "🇯🇴",
    "UAE": "🇦🇪",
  };
  return flags[countryName] || "🌍";
}
