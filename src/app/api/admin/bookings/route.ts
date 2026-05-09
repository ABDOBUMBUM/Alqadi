import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ 
      include: { client: true },
      orderBy: { createdAt: "desc" } 
    });
    return NextResponse.json(bookings);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const booking = await prisma.booking.create({ data });
    return NextResponse.json(booking);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const booking = await prisma.booking.update({ where: { id }, data: updateData });
    return NextResponse.json(booking);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
