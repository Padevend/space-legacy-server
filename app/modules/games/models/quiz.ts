import type { QuizLevel } from '#shared/enums';

export interface QuizOptionDto {
  id: string;
  label: string;
  sortOrder: number;
}

export interface QuizQuestionDto {
  id: string;
  prompt: string;
  sortOrder: number;
  options: QuizOptionDto[];
}

export interface QuizSummaryDto {
  id: string;
  slug: string;
  title: string;
  level: QuizLevel;
  body: { id: string; slug: string; name: string } | null;
  machine: { id: string; slug: string; name: string } | null;
  questionCount: number;
  createdAt: Date;
}

export interface QuizDetailDto {
  id: string;
  slug: string;
  title: string;
  level: QuizLevel;
  body: { id: string; slug: string; name: string } | null;
  machine: { id: string; slug: string; name: string } | null;
  questions: QuizQuestionDto[];
}

export interface EvaluatedAnswerDto {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttemptResultDto {
  id: string;
  quizId: string;
  quizSlug: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: EvaluatedAnswerDto[];
  createdAt: Date;
}
