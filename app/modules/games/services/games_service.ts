import { gamesRepository, GamesRepository } from '../repositories/games_repository.js';
import type { ListQuizzesQuery, SubmitAttemptInput } from '../validators/quiz.js';
import type { QuizSummaryDto, QuizDetailDto, QuizAttemptResultDto } from '../models/quiz.js';
import type { BadgeDto, VisitorProgressDto } from '../models/badge.js';
import { NotFoundError, ValidationError } from '#shared/errors';
import { BadgeRule } from '#shared/enums';

export class GamesService {
  private repo: GamesRepository;

  constructor(repo?: GamesRepository) {
    this.repo = repo ?? gamesRepository;
  }

  async listQuizzes(query: ListQuizzesQuery): Promise<QuizSummaryDto[]> {
    const rows = await this.repo.findPublishedQuizzes(query);

    return rows.map((q) => ({
      id: q.id,
      slug: q.slug,
      title: q.title,
      level: q.level,
      body: q.body,
      machine: q.machine,
      questionCount: q._count.questions,
      createdAt: q.createdAt,
    }));
  }

  async getQuizBySlug(slug: string): Promise<QuizDetailDto> {
    const quiz = await this.repo.findPublishedQuizBySlug(slug);
    if (!quiz) {
      throw new NotFoundError(`Quiz with slug '${slug}' not found.`);
    }

    // NEVER expose isCorrect or explanation in public quiz reader (Section 6)
    return {
      id: quiz.id,
      slug: quiz.slug,
      title: quiz.title,
      level: quiz.level,
      body: quiz.body,
      machine: quiz.machine,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        sortOrder: q.sortOrder,
        options: q.options.map((o) => ({
          id: o.id,
          label: o.label,
          sortOrder: o.sortOrder,
        })),
      })),
    };
  }

  async submitAttempt(
    slug: string,
    visitorId: string,
    input: SubmitAttemptInput
  ): Promise<{
    attempt: QuizAttemptResultDto;
    newBadges: Array<{
      id: string;
      slug: string;
      name: string;
      description: string;
      iconKey: string;
      earnedAt: Date;
    }>;
  }> {
    const quiz = await this.repo.findPublishedQuizBySlug(slug);
    if (!quiz) {
      throw new NotFoundError(`Quiz with slug '${slug}' not found.`);
    }

    const userAnswersMap = new Map<string, string>(input.answers.map((a) => [a.questionId, a.optionId]));

    let score = 0;
    const maxScore = quiz.questions.length;
    const evaluatedAnswers: Array<{
      questionId: string;
      optionId: string;
      isCorrect: boolean;
      explanation: string;
    }> = [];

    const dbAnswers: Array<{
      questionId: string;
      optionId: string;
      isCorrect: boolean;
    }> = [];

    for (const q of quiz.questions) {
      const selectedOptionId = userAnswersMap.get(q.id);
      if (!selectedOptionId) {
        throw new ValidationError(`Missing answer for question '${q.id}'.`);
      }

      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      if (!selectedOption) {
        throw new ValidationError(`Option '${selectedOptionId}' does not belong to question '${q.id}'.`);
      }

      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) {
        score++;
      }

      evaluatedAnswers.push({
        questionId: q.id,
        optionId: selectedOptionId,
        isCorrect,
        explanation: q.explanation,
      });

      dbAnswers.push({
        questionId: q.id,
        optionId: selectedOptionId,
        isCorrect,
      });
    }

    const result = await this.repo.executeTransaction(async (tx) => {
      // 1. Record attempt and answer rows
      const attempt = await this.repo.createAttemptWithAnswers(
        {
          visitorId,
          quizId: quiz.id,
          score,
          maxScore,
          answers: dbAnswers,
        },
        tx
      );

      // 2. Evaluate Badge rules for visitor
      const allBadges = await this.repo.findAllBadges(tx);
      const earnedVisitorBadges = await this.repo.findVisitorBadges(visitorId, tx);
      const earnedBadgeIds = new Set(earnedVisitorBadges.map((vb) => vb.badgeId));

      const stats = await this.repo.getVisitorStats(visitorId, tx);
      const newlyAwarded: Array<{
        id: string;
        slug: string;
        name: string;
        description: string;
        iconKey: string;
        earnedAt: Date;
      }> = [];

      for (const badge of allBadges) {
        if (earnedBadgeIds.has(badge.id)) continue;

        let eligible = false;

        switch (badge.rule) {
          case BadgeRule.QUIZ_COMPLETED_COUNT:
            if (stats.completedQuizzesCount >= badge.threshold) {
              eligible = true;
            }
            break;

          case BadgeRule.PERFECT_SCORE_COUNT:
            if (stats.perfectScoresCount >= badge.threshold) {
              eligible = true;
            }
            break;

          case BadgeRule.BODY_ALL_QUIZZES:
            if (badge.bodyId) {
              const bodyQuizzes = await this.repo.findPublishedQuizzes({ body: badge.body?.slug });
              const bodyQuizIds = bodyQuizzes.map((bq) => bq.id);
              const completedCount = bodyQuizIds.filter((id) => stats.completedQuizIds.has(id)).length;
              if (
                (badge.threshold > 0 && completedCount >= badge.threshold) ||
                (bodyQuizIds.length > 0 && bodyQuizIds.every((id) => stats.completedQuizIds.has(id)))
              ) {
                eligible = true;
              }
            }
            break;
        }

        if (eligible) {
          const awarded = await this.repo.awardBadge(visitorId, badge.id, new Date(), tx);
          newlyAwarded.push({
            id: badge.id,
            slug: badge.slug,
            name: badge.name,
            description: badge.description,
            iconKey: badge.iconKey,
            earnedAt: awarded.earnedAt,
          });
        }
      }

      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      const attemptResult: QuizAttemptResultDto = {
        id: attempt.id,
        quizId: quiz.id,
        quizSlug: quiz.slug,
        score,
        maxScore,
        percentage,
        answers: evaluatedAnswers,
        createdAt: attempt.createdAt,
      };

      return {
        attempt: attemptResult,
        newBadges: newlyAwarded,
      };
    });

    return result;
  }

  async getVisitorProgress(visitorId: string): Promise<VisitorProgressDto> {
    const stats = await this.repo.getVisitorStats(visitorId);
    const recentAttempts = await this.repo.getVisitorAttempts(visitorId);
    const visitorBadges = await this.repo.findVisitorBadges(visitorId);

    return {
      visitorId,
      totalAttempts: stats.totalAttempts,
      completedQuizzesCount: stats.completedQuizzesCount,
      perfectScoresCount: stats.perfectScoresCount,
      badgesCount: visitorBadges.length,
      recentAttempts: recentAttempts.slice(0, 10).map((a) => ({
        id: a.id,
        quizSlug: a.quiz.slug,
        quizTitle: a.quiz.title,
        score: a.score,
        maxScore: a.maxScore,
        createdAt: a.createdAt,
      })),
      badges: visitorBadges.map((vb) => ({
        id: vb.badge.id,
        slug: vb.badge.slug,
        name: vb.badge.name,
        description: vb.badge.description,
        iconKey: vb.badge.iconKey,
        earnedAt: vb.earnedAt,
      })),
    };
  }

  async listBadges(visitorId?: string): Promise<BadgeDto[]> {
    const badges = await this.repo.findAllBadges();
    const earnedMap = new Map<string, Date>();

    if (visitorId) {
      const visitorBadges = await this.repo.findVisitorBadges(visitorId);
      for (const vb of visitorBadges) {
        earnedMap.set(vb.badgeId, vb.earnedAt);
      }
    }

    return badges.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description,
      iconKey: b.iconKey,
      rule: b.rule,
      threshold: b.threshold,
      body: b.body,
      sortOrder: b.sortOrder,
      unlocked: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id) ?? null,
    }));
  }
}

export const gamesService = new GamesService();
