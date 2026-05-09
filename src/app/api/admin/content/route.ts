import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// Helper to structure the JSON content
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const dbContent: Record<string, any> = {};

    settings.forEach((s) => {
      dbContent[s.key] = s.value;
    });

    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        branch: true,
        active: true,
      },
    });

    const content = {
      company: dbContent.company || {
        nameAr: "مجموعة القاضي الذهبية",
        nameEn: "Golden Al'Qadi Group",
        phone: "+96598765432",
        email: "info@alqadigroup.com",
        address: "الكويت",
        whatsapp: "96598765432",
        foundedYear: "1980",
        taglineAr: "السفريات والسياحة",
        taglineEn: "Travel & Tourism",
      },
      stats: dbContent.stats || {
        clients: "860,000+",
        experience: "45+",
        countries: "75+",
        satisfaction: "98%",
      },
      destinations: dbContent.destinations || [],
      packages: dbContent.packages || [],
      jobs: dbContent.jobs || [],
      branches: dbContent.branches || [],
      pricing: dbContent.pricing || [],
      employees: employees.map((e) => ({
        ...e,
        shift: "morning", // Shift could be added to DB later if needed
      })),
    };

    return NextResponse.json(content);
  } catch (error) {
    console.error("Admin Content GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const content = await req.json();

    const keysToUpdate = [
      "company",
      "stats",
      "destinations",
      "packages",
      "jobs",
      "branches",
      "pricing",
      // CMS pages
      "cms_about",
      "cms_contact",
      "cms_blog",
      "cms_faq",
      "cms_clients",
      "cms_vip",
      "cms_home",
      "cms_travel",
    ];

    for (const key of keysToUpdate) {
      if (content[key]) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: content[key] },
          create: { key, value: content[key] },
        });
      }
    }

    if (content.employees && Array.isArray(content.employees)) {
      for (const emp of content.employees) {
        if (emp.id) {
          const updateData: any = {
            name: emp.name,
            username: emp.username,
            phone: emp.phone,
            role: emp.role,
            branch: emp.branch,
            active: emp.active,
          };
          
          // Only hash if a real (non-masked) new password was sent
          if (emp.password && !emp.password.startsWith("••") && emp.password.length >= 6) {
             updateData.password = await hash(emp.password, 12);
          }

          await prisma.employee.update({
            where: { id: emp.id },
            data: updateData,
          });
        } else {
          // New employee
          await prisma.employee.create({
            data: {
              name: emp.name,
              username: emp.username,
              password: await hash(emp.password || crypto.randomUUID().slice(0, 12), 12),
              phone: emp.phone,
              role: emp.role,
              branch: emp.branch,
              active: emp.active ?? true,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Content POST Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
