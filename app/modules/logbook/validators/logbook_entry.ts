import { z } from 'zod';

export const machineLogbookParamsSchema = z.object({
  slug: z.string().min(1).max(100),
});

export const machineLogbookEntryParamsSchema = z.object({
  slug: z.string().min(1).max(100),
  entry: z.string().min(1).max(100),
});

export type MachineLogbookParams = z.infer<typeof machineLogbookParamsSchema>;
export type MachineLogbookEntryParams = z.infer<typeof machineLogbookEntryParamsSchema>;
