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

// Admin Validation Schemas
export const machineIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const machineSubResourceParamSchema = z.object({
  id: z.string().uuid(),
  subId: z.string().uuid(),
});

export const listAdminMachinesQuerySchema = z.object({
  bodyId: z.string().uuid().optional(),
  kind: z.nativeEnum(MachineKind).optional(),
  state: z.nativeEnum(MachineState).optional(),
  isPublished: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  q: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const createMachineSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  bodyId: z.string().uuid(),
  name: z.string().min(1),
  kind: z.nativeEnum(MachineKind),
  state: z.nativeEnum(MachineState),
  stateSince: z.string().nullable().optional(),
  launchYear: z.number().int().nullable().optional(),
  arrivalYear: z.number().int().nullable().optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  missionPurpose: z.string().min(1),
  howItWorked: z.string().min(1),
  discoveries: z.string().min(1),
  currentStatusNote: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export const updateMachineSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
      .optional(),
    bodyId: z.string().uuid().optional(),
    name: z.string().min(1).optional(),
    kind: z.nativeEnum(MachineKind).optional(),
    state: z.nativeEnum(MachineState).optional(),
    stateSince: z.string().nullable().optional(),
    launchYear: z.number().int().nullable().optional(),
    arrivalYear: z.number().int().nullable().optional(),
    summary: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    missionPurpose: z.string().min(1).optional(),
    howItWorked: z.string().min(1).optional(),
    discoveries: z.string().min(1).optional(),
    currentStatusNote: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();

export const createSourceSchema = z.object({
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
});

export const updateSourceSchema = z
  .object({
    title: z.string().min(1).optional(),
    publisher: z.string().min(1).optional(),
    url: z.string().url().optional(),
  })
  .strict();

export const createFactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().nullable().optional(),
  sourceId: z.string().uuid(),
  sortOrder: z.number().int().default(0),
});

export const updateFactSchema = z
  .object({
    label: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
    unit: z.string().nullable().optional(),
    sourceId: z.string().uuid().optional(),
    sortOrder: z.number().int().optional(),
  })
  .strict();

export const createEventSchema = z.object({
  dateLabel: z.string().min(1),
  dateIso: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  title: z.string().min(1),
  description: z.string().min(1),
  sourceId: z.string().uuid(),
  sortOrder: z.number().int().default(0),
});

export const updateEventSchema = z
  .object({
    dateLabel: z.string().min(1).optional(),
    dateIso: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    sourceId: z.string().uuid().optional(),
    sortOrder: z.number().int().optional(),
  })
  .strict();

export const createImageSchema = z.object({
  path: z.string().min(1),
  alt: z.string().min(1),
  label: z.nativeEnum(MediaLabel),
  credit: z.string().min(1),
  sourceUrl: z.string().url().nullable().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  isCover: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const updateImageSchema = z
  .object({
    path: z.string().min(1).optional(),
    alt: z.string().min(1).optional(),
    label: z.nativeEnum(MediaLabel).optional(),
    credit: z.string().min(1).optional(),
    sourceUrl: z.string().url().nullable().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    isCover: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  })
  .strict();
