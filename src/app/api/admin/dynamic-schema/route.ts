import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") ?? "";
    const schemas = await prisma.dynamicSchema.findMany({
      where: name ? { name: { contains: name } } : undefined,
      include: { records: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(schemas);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch schemas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, labelAr, fields } = await req.json();
    const schema = await prisma.dynamicSchema.create({
      data: { name, labelAr: labelAr ?? name, fields },
    });
    return NextResponse.json(schema);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create schema" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });
    await prisma.dynamicRecord.deleteMany({ where: { schemaId: id } });
    await prisma.dynamicSchema.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete schema" }, { status: 500 });
  }
}
