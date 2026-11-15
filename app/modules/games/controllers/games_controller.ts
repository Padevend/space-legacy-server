import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { gamesService, GamesService } from '../services/games_service.js';
import { listQuizzesQuerySchema, quizSlugParamSchema, submitAttemptSchema } from '../validators/quiz.js';
import { jsonSuccess } from '#shared/http';
import { UnauthorizedError } from '#shared/errors';

export class GamesController {
  private service: GamesService;

  constructor(service?: GamesService) {
    this.service = service instanceof GamesService ? service : gamesService;
  }

  listQuizzes = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && ctxOrC.query ? ctxOrC.query : c.req.query();
    const query = listQuizzesQuerySchema.parse(rawQuery);

    const quizzes = await this.service.listQuizzes(query);
    return jsonSuccess(c, { quizzes });
  };

  showQuiz = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const slug = (('params' in ctxOrC && ctxOrC.params?.['slug']) || c.req.param('slug')) ?? '';
    const { slug: cleanSlug } = quizSlugParamSchema.parse({ slug });

    const quiz = await this.service.getQuizBySlug(cleanSlug);
    return jsonSuccess(c, { quiz });
  };

  submitAttempt = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Session required to participate in quizzes.');
    }

    const slug = (('params' in ctxOrC && ctxOrC.params?.['slug']) || c.req.param('slug')) ?? '';
    const { slug: cleanSlug } = quizSlugParamSchema.parse({ slug });

    const body = await c.req.json();
    const input = submitAttemptSchema.parse(body);

    const result = await this.service.submitAttempt(cleanSlug, visitorId, input);
    return jsonSuccess(c, result, 201);
  };

  progress = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Session required to view progress.');
    }

    const progress = await this.service.getVisitorProgress(visitorId);
    return jsonSuccess(c, { progress });
  };

  listBadges = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;

    const badges = await this.service.listBadges(visitorId);
    return jsonSuccess(c, { badges });
  };
}

export const gamesController = new GamesController();
