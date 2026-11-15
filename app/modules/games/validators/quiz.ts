import { z } from 'zod';
import { QuizLevel } from '#shared/enums';

export const listQuizzesQuerySchema = z.object({
  body: z.string().trim().min(1).optional(),
  machine: z.string().trim().min(1).optional(),
  level: z.nativeEnum(QuizLevel).optional(),
});

export const quizSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(100),
});

export const submitAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid('Invalid question ID format'),
        optionId: z.string().uuid('Invalid option ID format'),
      })
    )
    .min(1, 'At least one answer must be submitted'),
});

export type ListQuizzesQuery = z.infer<typeof listQuizzesQuerySchema>;
export type QuizSlugParam = z.infer<typeof quizSlugParamSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
