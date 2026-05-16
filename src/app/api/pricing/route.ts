import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const pricing = await prisma.pricing.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const newPricing = await prisma.pricing.create({ data });
    return NextResponse.json(newPricing);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pricing" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const { id, ...rest } = data;
    const updated = await prisma.pricing.update({ where: { id }, data: rest });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.pricing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pricing" }, { status: 500 });
  }
}
