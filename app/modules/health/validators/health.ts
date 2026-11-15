import { z } from 'zod';

export const healthLiveResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
  uptimeSeconds: z.number(),
});

export const healthReadyResponseSchema = z.object({
  status: z.literal('ready'),
  timestamp: z.string().datetime(),
  database: z.literal('connected'),
  latencyMs: z.number().optional(),
});

export type HealthLiveResponse = z.infer<typeof healthLiveResponseSchema>;
export type HealthReadyResponse = z.infer<typeof healthReadyResponseSchema>;
