import { z } from 'zod';
import { MachineKind, MachineState, MediaLabel } from '#shared/enums';

export const machineFilterQuerySchema = z.object({
  body: z.string().optional(),
  kind: z.nativeEnum(MachineKind).optional(),
  state: z.nativeEnum(MachineState).optional(),
  decade: z
    .string()
    .regex(/^\d{4}$/, 'Decade must be a 4-digit year like 1960, 1970, 2010')
    .transform((val) => parseInt(val, 10))
    .optional(),
  q: z.string().trim().optional(),
  cursor: z.string().optional(),
  limit: z
    .preprocess((val) => (val === undefined ? 20 : parseInt(String(val), 10)), z.number().int().min(1).max(50))
    .default(20),
});

export type MachineFilterQuery = z.infer<typeof machineFilterQuerySchema>;

export const machineImageSchema = z.object({
  id: z.string().uuid(),
  path: z.string(),
  alt: z.string(),
  label: z.nativeEnum(MediaLabel),
  credit: z.string(),
  sourceUrl: z.string().nullable(),
  width: z.number().int(),
  height: z.number().int(),
  isCover: z.boolean(),
  sortOrder: z.number().int(),
});

export const machineSourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  publisher: z.string(),
  url: z.string(),
});

export const machineFactSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  value: z.string(),
  unit: z.string().nullable(),
  sortOrder: z.number().int(),
  sourceId: z.string().uuid(),
  source: machineSourceSchema.optional(),
});

export const machineEventSchema = z.object({
  id: z.string().uuid(),
  dateLabel: z.string(),
  dateIso: z.string().nullable(),
  title: z.string(),
  description: z.string(),
  sortOrder: z.number().int(),
  sourceId: z.string().uuid(),
  source: machineSourceSchema.optional(),
});

export const machineSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  body: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
  }),
  name: z.string(),
  kind: z.nativeEnum(MachineKind),
  state: z.nativeEnum(MachineState),
  stateSince: z.string().nullable(),
  launchYear: z.number().int().nullable(),
  arrivalYear: z.number().int().nullable(),
  summary: z.string(),
  coverImage: machineImageSchema.nullable(),
});

export type MachineSummaryDto = z.infer<typeof machineSummarySchema>;

export const machineDetailSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  body: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
  }),
  name: z.string(),
  kind: z.nativeEnum(MachineKind),
  state: z.nativeEnum(MachineState),
  stateSince: z.string().nullable(),
  launchYear: z.number().int().nullable(),
  arrivalYear: z.number().int().nullable(),
  summary: z.string(),
  description: z.string(),
  missionPurpose: z.string(),
  howItWorked: z.string(),
  discoveries: z.string(),
  currentStatusNote: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  sources: z.array(machineSourceSchema),
  facts: z.array(machineFactSchema),
  events: z.array(machineEventSchema),
  images: z.array(machineImageSchema),
});

export type MachineDetailDto = z.infer<typeof machineDetailSchema>;
