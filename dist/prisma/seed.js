import { prisma } from '../src/core/database/prisma.js';
import { hashPassword } from '../src/core/security/password.js';
export async function main() {
    // eslint-disable-next-line no-console
    console.log('Seeding SPACE LEGACY database with clearly fake-marked test data...');
    const adminPasswordHash = await hashPassword('AdminSpaceLegacy2026!');
    const editorPasswordHash = await hashPassword('EditorSpaceLegacy2026!');
    // Seed Admin & Editor
    const admin = await prisma.user.upsert({
        where: { email: 'admin@spacelegacy.test' },
        update: {},
        create: {
            email: 'admin@spacelegacy.test',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            isActive: true,
        },
    });
    const editor = await prisma.user.upsert({
        where: { email: 'editor@spacelegacy.test' },
        update: {},
        create: {
            email: 'editor@spacelegacy.test',
            passwordHash: editorPasswordHash,
            role: 'EDITOR',
            isActive: true,
        },
    });
    // Seed sample Celestial Bodies
    const moon = await prisma.celestialBody.upsert({
        where: { name: 'Moon [TEST-SEED]' },
        update: {},
        create: {
            name: 'Moon [TEST-SEED]',
            bodyType: 'MOON',
            description: 'The natural satellite of Earth [TEST DATA - NOT A REAL RECORD].',
        },
    });
    const mars = await prisma.celestialBody.upsert({
        where: { name: 'Mars [TEST-SEED]' },
        update: {},
        create: {
            name: 'Mars [TEST-SEED]',
            bodyType: 'PLANET',
            description: 'The Red Planet [TEST DATA - NOT A REAL RECORD].',
        },
    });
    // eslint-disable-next-line no-console
    console.log('Seed completed successfully:', {
        admin: admin.email,
        editor: editor.email,
        celestialBodies: [moon.name, mars.name],
    });
}
main()
    .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
