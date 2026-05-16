import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  // Rate limit: 30 requests per minute per IP
  const ip = getClientIp(request);
  const limit = rateLimit(`hotels:${ip}`, 30, 60_000);
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
    const hotels = await prisma.hotel.findMany({
      where: { active: true },
      include: {
        rooms: {
          where: { available: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(hotels, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    console.error("Hotels API error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات الفنادق" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        nameEn: data.nameEn,
        city: data.city,
        country: data.country,
        stars: data.stars || 4,
        description: data.description,
        priceFrom: data.priceFrom || 0,
        currency: data.currency || "KWD",
        images: data.images || [],
        amenities: data.amenities || [],
        featured: data.featured || false,
        active: data.active ?? true,
      },
    });
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Hotels POST error:", error);
    return NextResponse.json({ error: "فشل في إضافة الفندق" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: "معرف الفندق مطلوب" }, { status: 400 });
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Hotels PUT error:", error);
    return NextResponse.json({ error: "فشل في تحديث الفندق" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "معرف الفندق مطلوب" }, { status: 400 });
    }

    await prisma.hotel.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hotels DELETE error:", error);
    return NextResponse.json({ error: "فشل في حذف الفندق" }, { status: 500 });
  }
}
