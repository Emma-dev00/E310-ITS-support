const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  'Computer/Laptop',
  'Network',
  'Printer',
  'Account/Access',
  'Software',
  'Hardware',
  'Other',
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed categories
  console.log('Seeding categories...');
  for (const name of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✅ ${DEFAULT_CATEGORIES.length} categories verified/seeded.`);

  // 2. Seed initial Technical Lead / Admin if none exists
  const adminEmail = 'admin@e310.internal';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'TECHNICAL_LEAD_ADMIN',
        isFirstLogin: false,
      },
    });
    console.log(`✅ Created initial admin user: ${admin.email} (Password: Admin@123456)`);
  } else {
    console.log(`ℹ️ Admin user ${adminEmail} already exists.`);
  }

  console.log('🎉 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
