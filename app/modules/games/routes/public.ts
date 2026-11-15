import type { Router } from '#infrastructure/http/router';
import { GamesController } from '../controllers/games_controller.js';
import { auth } from '#middleware/auth_middleware';

export function registerGamesPublicRoutes(router: Router): void {
  const r = router.forModule('games');

  // Quizzes list & detail (Section 6: NEVER expose isCorrect in showQuiz)
  r.get('/quizzes', [GamesController, 'listQuizzes'])
    .use(auth({ optional: true }))
    .as('games.quizzes_list');

  r.get('/quizzes/:slug', [GamesController, 'showQuiz'])
    .use(auth({ optional: true }))
    .as('games.quizzes_show');

  // Submit attempt (Requires active session, notes attempt and awards badges)
  r.post('/quizzes/:slug/attempts', [GamesController, 'submitAttempt']).use(auth()).as('games.submit_attempt');

  // Visitor personal progress & badges
  r.get('/me/progress', [GamesController, 'progress']).use(auth()).as('games.me_progress');

  r.get('/badges', [GamesController, 'listBadges'])
    .use(auth({ optional: true }))
    .as('games.badges_list');
}
