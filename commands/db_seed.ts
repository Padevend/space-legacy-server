import { main } from '../prisma/seed.js';

export async function dbSeedCommand(): Promise<void> {
  await main();
}
