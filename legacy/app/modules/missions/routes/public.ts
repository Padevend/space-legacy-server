import type { Router } from '#infrastructure/http/router';
import { MissionController } from '../controllers/mission_controller.js';
import { listMissionsQuerySchema, getMissionQuerySchema, missionSchema } from '../validators/mission.js';

export function registerMissionsPublicRoutes(router: Router): void {
  const r = router.forModule('missions');

  r.get('/missions', [MissionController, 'index'])
    .as('missions.index')
    .validate({ query: listMissionsQuerySchema })
    .docs({
      summary: 'List NASA space missions with pagination and filtering',
      tags: ['Missions'],
      responses: { 200: 'List of missions' },
    });

  r.get('/missions/:idOrSlug', [MissionController, 'show'])
    .as('missions.show')
    .where('idOrSlug', r.matchers.idOrSlug())
    .validate({ query: getMissionQuerySchema })
    .docs({
      summary: 'Get single mission by UUID or slug with optional includes',
      tags: ['Missions'],
      responses: { 200: missionSchema, 404: 'NOT_FOUND' },
    });
}
