const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'change_this_admin_password';
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
      },
      create: {
        email: adminEmail,
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();