import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();
  const pw = await hash("Admin@DevOnly2026", 12);
  await prisma.employee.update({
    where: { username: "admin" },
    data: { password: pw },
  });
  console.log("✅ Admin password reset to: Admin@DevOnly2026");
  await prisma.$disconnect();
}

main().catch(console.error);
