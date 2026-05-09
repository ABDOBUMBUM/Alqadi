import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tickets = await prisma.supportTicket.findMany({
      where: status && status !== "all" ? { status } : undefined,
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ticket = await prisma.supportTicket.create({ data });
    return NextResponse.json(ticket);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const ticket = await prisma.supportTicket.update({ where: { id }, data: updateData });
    return NextResponse.json(ticket);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
