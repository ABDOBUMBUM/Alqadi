import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, username: true, role: true, branchId: true, shift: true, phone: true, email: true, active: true, title: true, createdAt: true, branch: { select: { id: true, name: true } } },
    });
    return NextResponse.json(employees);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { password, ...data } = await req.json();
    const hashedPassword = await bcrypt.hash(password || "CHANGE_ME", 10);
    if (data.branchId === "") data.branchId = null;
    const employee = await prisma.employee.create({ 
      data: { ...data, password: hashedPassword } 
    });
    return NextResponse.json(employee);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, password, ...updateData } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const finalData = { ...updateData };
    if (password) {
      finalData.password = await bcrypt.hash(password, 10);
    }
    if (finalData.branchId === "") finalData.branchId = null;

    const employee = await prisma.employee.update({ 
      where: { id }, 
      data: finalData 
    });
    return NextResponse.json(employee);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
