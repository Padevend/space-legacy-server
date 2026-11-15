import { prisma } from '../../app/infrastructure/database/prisma_client.js';
import { Prisma } from '@prisma/client';

export async function pingDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function countTableRows(tableName: string): Promise<number> {
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  const result = await prisma.$queryRaw<{ count: string }[]>(
    Prisma.sql`SELECT COUNT(*)::text as count FROM ${Prisma.raw(`"${tableName}"`)}`
  );
  const row = result[0];
  return row ? parseInt(row.count, 10) : 0;
}

export async function cleanTables(tableNames: string[]): Promise<void> {
  if (process.env['NODE_ENV'] !== 'test') {
    throw new Error('cleanTables is only permitted in test environment');
  }

  for (const table of tableNames) {
    if (!/^[a-zA-Z0-9_]+$/.test(table)) {
      throw new Error(`Invalid table name: ${table}`);
    }
    await prisma.$executeRaw(Prisma.sql`TRUNCATE TABLE ${Prisma.raw(`"${table}"`)} CASCADE`);
  }
}
