import { PrismaClient } from '@prisma/client';

import { createTestUser, createTestUserAccount } from '../lib/prisma';

const prisma = new PrismaClient();

async function seed() {
  const env = process.env.NEXT_PUBLIC_APP_ENV?.toUpperCase();
  console.log(`🌱 seeding Users...in ${env}`);

  const testUser = createTestUser({ email: 'e2e@e2e.test' });

  await prisma.$transaction(
    ['admin', 'user', 'test'].map((type) =>
      prisma.role.upsert({
        where: { type },
        update: {},
        create: { type },
      })
    )
  );

  await prisma.user.upsert({
    where: { email: String(testUser.email) },
    update: {},
    create: {
      ...testUser,
    },
  });
}

seed()
  .catch(async (e) => {
    console.error('🌱 error', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    console.log('🌱 Seeding Complete');
    await prisma.$disconnect();
  });
