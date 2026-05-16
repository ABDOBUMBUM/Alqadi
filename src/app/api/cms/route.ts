import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const pages = await prisma.cmsPage.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cms pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    // Upsert: if slug already exists update it, otherwise create
    const newPage = await prisma.cmsPage.upsert({
      where: { slug: data.slug },
      update: { content: data.content, title: data.title ?? data.slug, active: true, updatedAt: new Date() },
      create: { ...data, active: true },
    });
    return NextResponse.json(newPage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create cms page" }, { status: 500 });
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
    const updated = await prisma.cmsPage.update({ where: { id }, data: { ...rest, active: true, updatedAt: new Date() } });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cms page" }, { status: 500 });
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
    await prisma.cmsPage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete cms page" }, { status: 500 });
  }
}
