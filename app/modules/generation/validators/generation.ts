import { z } from 'zod';
import { GenerationKind, GenerationStatus } from '#shared/enums';

export const createGenerationJobSchema = z.object({
  logbookEntryId: z.string().uuid(),
  kind: z.nativeEnum(GenerationKind),
  prompt: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  simulateFailure: z.boolean().optional(),
  simulateUntrustedHost: z.boolean().optional(),
});

export const generationJobIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listGenerationJobsQuerySchema = z.object({
  status: z.nativeEnum(GenerationStatus).optional(),
  kind: z.nativeEnum(GenerationKind).optional(),
  logbookEntryId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
