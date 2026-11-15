import { z } from 'zod';
import { MachineKind, MachineState, MediaLabel, QuizLevel, IngestionStatus } from '#shared/enums';

export const bundleManifestSchema = z.object({
  schemaVersion: z.literal(1),
  machines: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Machine slug must be kebab-case')),
  quizzes: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Quiz slug must be kebab-case')).default([]),
});

export const bundleSourceSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
});

export const bundleFactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().nullable().optional(),
  sourceKey: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const bundleEventSchema = z.object({
  dateLabel: z.string().min(1),
  dateIso: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  title: z.string().min(1),
  description: z.string().min(1),
  sourceKey: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const bundleImageSchema = z.object({
  filename: z.string().min(1),
  alt: z.string().min(1),
  label: z.nativeEnum(MediaLabel),
  credit: z.string().min(1),
  sourceUrl: z.string().url().nullable().optional(),
  isCover: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const bundleMachineSchema = z.object({
  body: z.string().min(1),
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
  sources: z.array(bundleSourceSchema).min(1, 'Machine must have at least one source (N7)'),
  facts: z.array(bundleFactSchema).default([]),
  timeline: z.array(bundleEventSchema).default([]),
  images: z.array(bundleImageSchema).default([]),
});

export const bundleQuizOptionSchema = z.object({
  label: z.string().min(1),
  isCorrect: z.boolean(),
  sortOrder: z.number().int().default(0),
});

export const bundleQuizQuestionSchema = z.object({
  prompt: z.string().min(1),
  explanation: z.string().min(1),
  sortOrder: z.number().int().default(0),
  options: z
    .array(bundleQuizOptionSchema)
    .min(2, 'Question must have at least 2 options')
    .max(4, 'Question cannot have more than 4 options')
    .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, {
      message: 'Question must have exactly one correct option',
    }),
});

export const bundleQuizSchema = z.object({
  title: z.string().min(1),
  level: z.nativeEnum(QuizLevel),
  body: z.string().nullable().optional(),
  machine: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
  questions: z.array(bundleQuizQuestionSchema).min(1, 'Quiz must have at least 1 question'),
});

export const ingestionBatchIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listIngestionBatchesQuerySchema = z.object({
  status: z.nativeEnum(IngestionStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
