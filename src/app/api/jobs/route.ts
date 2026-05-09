import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch all jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    
    // For public API, only show active jobs
    let whereClause: any = {};
    if (admin !== "true") {
      whereClause.active = true;
    }
    if (category) whereClause.category = category;
    if (country) whereClause.country = country;

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST: Create a new job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const job = await prisma.job.create({
      data: {
        title: data.title,
        titleEn: data.titleEn,
        category: data.category || "general",
        country: data.country,
        salary: Number(data.salary) || 0,
        currency: data.currency || "KWD",
        experience: data.experience,
        description: data.description,
        requirements: data.requirements || [],
        active: data.active !== undefined ? data.active : true,
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

// PUT: Update an existing job
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    if (updateData.salary !== undefined) updateData.salary = Number(updateData.salary);

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE: Delete a job
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
