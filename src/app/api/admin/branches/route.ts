import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(branches);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const branch = await prisma.branch.create({ data });
    return NextResponse.json(branch);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const branch = await prisma.branch.update({ where: { id }, data });
    return NextResponse.json(branch);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}
