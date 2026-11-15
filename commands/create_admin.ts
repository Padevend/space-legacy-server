import crypto from 'node:crypto';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword, validatePasswordStrength } from '#infrastructure/security/password_hasher';
import { logger } from '#infrastructure/logger/logger';

export interface CreateAdminOptions {
  email?: string | undefined;
  password?: string | undefined;
}

export async function createAdminCommand(options: CreateAdminOptions = {}): Promise<void> {
  const email = (options.email ?? 'admin@spacelegacy.org').trim().toLowerCase();
  let password = options.password;
  let isGenerated = false;

  if (!password) {
    const raw = crypto.randomBytes(16).toString('base64url');
    password = `Admin!2026_${raw}`;
    isGenerated = true;
  }

  try {
    validatePasswordStrength(password);
  } catch (err) {
    logger.error({ err }, 'Password does not meet complexity requirements.');
    // eslint-disable-next-line no-console
    console.error('Error: Password does not meet security requirements (min 12 chars).');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Successfully updated existing administrator account: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
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
