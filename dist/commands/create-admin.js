import { prisma } from '../src/core/database/prisma.js';
import { hashPassword, validatePasswordStrength } from '../src/core/security/password.js';
import { logger } from '../src/core/logger/index.js';
import crypto from 'node:crypto';
export async function createAdminCommand(options = {}) {
    const email = (options.email ?? 'admin@spacelegacy.org').trim().toLowerCase();
    let password = options.password;
    let isGenerated = false;
    if (!password) {
        // Generate a high-entropy 20-character password
        const raw = crypto.randomBytes(16).toString('base64url');
        password = `Admin!2026_${raw}`;
        isGenerated = true;
    }
    try {
        validatePasswordStrength(password);
    }
    catch (err) {
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
    }
    else {
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
