import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.employee.findMany();
  console.log('Employees:', users.map(u => ({ id: u.id, username: u.username, role: u.role, branchId: u.branchId, shift: u.shift })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
