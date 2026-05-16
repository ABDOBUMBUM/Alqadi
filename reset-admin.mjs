import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.employee.upsert({
    where: { username: 'admin' },
    update: { password: hash, role: 'admin', active: true },
    create: {
      name: 'مدير النظام',
      username: 'admin',
      password: hash,
      role: 'admin',
      active: true,
      title: 'مدير عام',
      shift: 'صباحي',
    }
  });
  console.log('Admin password reset to admin123');
  process.exit(0);
}

resetAdmin();
