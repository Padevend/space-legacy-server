import type { BadgeRule } from '#shared/enums';

export interface BadgeDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  rule: BadgeRule;
  threshold: number;
  body: { id: string; slug: string; name: string } | null;
  sortOrder: number;
  unlocked: boolean;
  earnedAt: Date | null;
}

export interface VisitorProgressDto {
  visitorId: string;
  totalAttempts: number;
  completedQuizzesCount: number;
  perfectScoresCount: number;
  badgesCount: number;
  recentAttempts: Array<{
    id: string;
    quizSlug: string;
    quizTitle: string;
    score: number;
    maxScore: number;
    createdAt: Date;
  }>;
  badges: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    iconKey: string;
    earnedAt: Date;
  }>;
}
