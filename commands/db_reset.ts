import { execSync } from 'node:child_process';
import { prisma } from '#infrastructure/database/prisma_client';
import { main as seedMain } from '../prisma/seed.js';

export async function dbResetCommand(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Resetting database schema...');

  await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE;');
  await prisma.$executeRawUnsafe('CREATE SCHEMA public;');
  await prisma.$disconnect();

  // eslint-disable-next-line no-console
  console.log('Deploying clean migrations...');
  execSync('pnpm exec prisma migrate deploy', { stdio: 'inherit' });

  // eslint-disable-next-line no-console
  console.log('Seeding initial data...');
  await seedMain();

  // eslint-disable-next-line no-console
  console.log('Database reset and seed complete.');
}

if (process.argv[1]?.endsWith('db_reset.ts')) {
  dbResetCommand().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('db:reset error:', err);
    process.exit(1);
  });
}
