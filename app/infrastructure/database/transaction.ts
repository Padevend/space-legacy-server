import type { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './prisma_client.js';

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export async function runInTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>,
  options?: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel }
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return fn(tx as unknown as TransactionClient);
  }, options);
}
