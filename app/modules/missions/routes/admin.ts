import type { Router } from '#infrastructure/http/router';
import { AdminMissionController } from '../controllers/admin_mission_controller.js';
import {
  createMissionRequestSchema,
  updateMissionRequestSchema,
  linkMissionEquipmentSchema,
  linkMissionPersonSchema,
} from '../validators/mission.js';
import { middleware } from '#start/kernel';

export function registerMissionsAdminRoutes(router: Router): void {
  const r = router.forModule('missions');

  r.post('/admin/missions', [AdminMissionController, 'store'])
    .as('admin.missions.store')
    .use(middleware.ability('missions:write'))
    .validate({ body: createMissionRequestSchema })
    .docs({
      summary: 'Create a new space mission',
      tags: ['Missions'],
      responses: { 201: 'Created mission', 409: 'CONFLICT' },
    });

  r.put('/admin/missions/:id', [AdminMissionController, 'update'])
    .as('admin.missions.update')
    .use(middleware.ability('missions:write'))
    .validate({ body: updateMissionRequestSchema })
    .docs({
      summary: 'Update an existing mission',
      tags: ['Missions'],
      responses: { 200: 'Updated mission', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/missions/:id', [AdminMissionController, 'update'])
    .as('admin.missions.patch')
    .use(middleware.ability('missions:write'))
    .validate({ body: updateMissionRequestSchema })
    .docs({
      summary: 'Update an existing mission',
      tags: ['Missions'],
      responses: { 200: 'Updated mission', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/missions/:id', [AdminMissionController, 'destroy'])
    .as('admin.missions.destroy')
    .use(middleware.ability('missions:delete'))
    .docs({
      summary: 'Delete a mission',
      tags: ['Missions'],
      responses: { 200: 'Deleted mission', 404: 'NOT_FOUND' },
    });

  // Mission equipment relation
  r.post('/admin/missions/:missionId/equipment/:equipmentId', [AdminMissionController, 'linkEquipment'])
    .as('admin.missions.linkEquipment')
    .use(middleware.ability('missions:write'))
    .validate({ body: linkMissionEquipmentSchema })
    .docs({ summary: 'Link equipment to mission with participation role', tags: ['Missions'] });

  r.put('/admin/missions/:missionId/equipment/:equipmentId', [AdminMissionController, 'linkEquipment'])
    .as('admin.missions.linkEquipmentPut')
    .use(middleware.ability('missions:write'))
    .docs({ summary: 'Link equipment to mission with participation role', tags: ['Missions'] });

  r.put('/admin/equipment/:equipmentId/missions/:missionId', [AdminMissionController, 'linkEquipment'])
    .as('admin.missions.linkEquipmentInversePut')
    .use(middleware.ability('missions:write'))
    .docs({ summary: 'Link equipment to mission with participation role', tags: ['Missions'] });

  r.delete('/admin/missions/:missionId/equipment/:equipmentId', [AdminMissionController, 'unlinkEquipment'])
    .as('admin.missions.unlinkEquipment')
    .use(middleware.ability('missions:write'))
    .docs({ summary: 'Unlink equipment from mission', tags: ['Missions'] });

  r.delete('/admin/equipment/:equipmentId/missions/:missionId', [AdminMissionController, 'unlinkEquipment'])
    .as('admin.missions.unlinkEquipmentInverse')
    .use(middleware.ability('missions:write'))
    .docs({ summary: 'Unlink equipment from mission', tags: ['Missions'] });

  // Mission person relation
  r.post('/admin/missions/:missionId/people/:personId', [AdminMissionController, 'linkPerson'])
    .as('admin.missions.linkPerson')
    .use(middleware.ability('missions:write'))
    .validate({ body: linkMissionPersonSchema })
    .docs({ summary: 'Link personnel to mission with mission role', tags: ['Missions'] });

  r.put('/admin/missions/:missionId/people/:personId', [AdminMissionController, 'linkPerson'])
    .as('admin.missions.linkPersonPut')
    .use(middleware.ability('missions:write'))
    .validate({ body: linkMissionPersonSchema })
    .docs({ summary: 'Link personnel to mission with mission role', tags: ['Missions'] });

  r.delete('/admin/missions/:missionId/people/:personId', [AdminMissionController, 'unlinkPerson'])
    .as('admin.missions.unlinkPerson')
    .use(middleware.ability('missions:write'))
    .docs({ summary: 'Unlink personnel from mission', tags: ['Missions'] });
}
