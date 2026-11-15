import { prisma } from './prisma.js';
export async function runInTransaction(fn, options) {
    return prisma.$transaction(async (tx) => {
        return fn(tx);
    }, options);
}
