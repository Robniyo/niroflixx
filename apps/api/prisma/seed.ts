import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'robertniyonkuru001@gmail.com' },
    update: {},
    create: {
      firstName: 'Niro',
      lastName: 'Bwimba',
      username: 'nirobwimba',
      email: 'robertniyonkuru001@gmail.com',
      phone: '+250795064502',
      password,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          nationality: 'the world',
          occupation: 'Founder & Developer',
          biography: 'Founder of Niroflixx Platform',
        },
      },
    },
  });

  console.log('Admin created:', admin.email);

  const categories = [
    { name: 'Programming', slug: 'programming' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Mobile Development', slug: 'mobile-development' },
    { name: 'UI/UX Design', slug: 'ui-ux-design' },
    { name: 'Cybersecurity', slug: 'cybersecurity' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Scholarships', slug: 'scholarships' },
    { name: 'Jobs', slug: 'jobs' },
    { name: 'Internships', slug: 'internships' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Education', slug: 'education' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories seeded');
  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });