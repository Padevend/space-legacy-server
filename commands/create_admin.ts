import crypto from 'node:crypto';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword, validatePassword } from '#shared/security/password';
import { logger } from '#shared/logger';

export interface CreateAdminOptions {
  email?: string | undefined;
  password?: string | undefined;
}

export async function createAdminCommand(options: CreateAdminOptions = {}): Promise<void> {
  const email = (options.email ?? 'admin@spacelegacy.test').trim().toLowerCase();
  let password = options.password;
  let isGenerated = false;

  if (!password) {
    const raw = crypto.randomBytes(12).toString('base64url');
    password = `Admin!2026_${raw}`;
    isGenerated = true;
  }

  try {
    validatePassword(password);
  } catch (err) {
    logger.error({ err }, 'Password does not meet complexity requirements.');
    // eslint-disable-next-line no-console
    console.error('Error: Password does not meet security requirements (min 10 chars).');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.account.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.account.update({
      where: { email },
      data: {
        passwordHash,
        role: 'ADMIN',
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Successfully updated existing administrator account: ${email}`);
  } else {
    const visitor = await prisma.visitor.create({ data: {} });
    await prisma.account.create({
      data: {
        visitorId: visitor.id,
        email,
        displayName: 'Administrator',
        passwordHash,
        role: 'ADMIN',
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Successfully created new administrator account: ${email}`);
  }

  if (isGenerated) {
    // eslint-disable-next-line no-console
    console.log(`Generated secure password: ${password}`);
    // eslint-disable-next-line no-console
    console.log('IMPORTANT: Store this password securely. It will not be shown again.');
  }

  await prisma.$disconnect();
}

if (process.argv[1]?.endsWith('create_admin.ts')) {
  createAdminCommand().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Create admin error:', err);
    process.exit(1);
  });
}
