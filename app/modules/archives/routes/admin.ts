import type { Router } from '#infrastructure/http/router';
import { AdminArchiveController } from '../controllers/admin_archive_controller.js';
import {
  listArchivesQuerySchema,
  createArchiveRequestSchema,
  linkArchiveMissionSchema,
  linkArchiveEquipmentSchema,
  linkArchiveEventSchema,
  linkArchiveSourceSchema,
} from '../validators/archive.js';
import { middleware } from '#start/kernel';

export function registerArchivesAdminRoutes(router: Router): void {
  const r = router.forModule('archives');

  r.get('/admin/archives', [AdminArchiveController, 'index'])
    .as('admin.archives.index')
    .use(middleware.ability('admin:access'))
    .validate({ query: listArchivesQuerySchema })
    .docs({ summary: 'List raw scraped archive records', tags: ['Archives'] });

  r.get('/admin/archives/:id', [AdminArchiveController, 'show'])
    .as('admin.archives.show')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Get single raw archive record by UUID', tags: ['Archives'] });

  r.post('/admin/archives', [AdminArchiveController, 'store'])
    .as('admin.archives.store')
    .use(middleware.ability('admin:access'))
    .validate({ body: createArchiveRequestSchema })
    .docs({ summary: 'Create raw archive record', tags: ['Archives'] });

  r.delete('/admin/archives/:id', [AdminArchiveController, 'destroy'])
    .as('admin.archives.destroy')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Delete raw archive record', tags: ['Archives'] });

  // Relations
  r.post('/admin/archives/:archiveId/missions/:missionId', [AdminArchiveController, 'linkMission'])
    .as('admin.archives.linkMission')
    .where('archiveId', r.matchers.uuid())
    .where('missionId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .validate({ body: linkArchiveMissionSchema })
    .docs({ summary: 'Link archive to mission', tags: ['Archives'] });

  r.delete('/admin/archives/:archiveId/missions/:missionId', [AdminArchiveController, 'unlinkMission'])
    .as('admin.archives.unlinkMission')
    .where('archiveId', r.matchers.uuid())
    .where('missionId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Unlink archive from mission', tags: ['Archives'] });

  r.post('/admin/archives/:archiveId/equipment/:equipmentId', [AdminArchiveController, 'linkEquipment'])
    .as('admin.archives.linkEquipment')
    .where('archiveId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .validate({ body: linkArchiveEquipmentSchema })
    .docs({ summary: 'Link archive to equipment', tags: ['Archives'] });

  r.delete('/admin/archives/:archiveId/equipment/:equipmentId', [AdminArchiveController, 'unlinkEquipment'])
    .as('admin.archives.unlinkEquipment')
    .where('archiveId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Unlink archive from equipment', tags: ['Archives'] });

  r.post('/admin/archives/:archiveId/events/:eventId', [AdminArchiveController, 'linkEvent'])
    .as('admin.archives.linkEvent')
    .where('archiveId', r.matchers.uuid())
    .where('eventId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .validate({ body: linkArchiveEventSchema })
    .docs({ summary: 'Link archive to event', tags: ['Archives'] });

  r.delete('/admin/archives/:archiveId/events/:eventId', [AdminArchiveController, 'unlinkEvent'])
    .as('admin.archives.unlinkEvent')
    .where('archiveId', r.matchers.uuid())
    .where('eventId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Unlink archive from event', tags: ['Archives'] });

  r.post('/admin/archives/:archiveId/sources/:sourceId', [AdminArchiveController, 'linkSource'])
    .as('admin.archives.linkSource')
    .where('archiveId', r.matchers.uuid())
    .where('sourceId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .validate({ body: linkArchiveSourceSchema })
    .docs({ summary: 'Link archive to source', tags: ['Archives'] });

  r.delete('/admin/archives/:archiveId/sources/:sourceId', [AdminArchiveController, 'unlinkSource'])
    .as('admin.archives.unlinkSource')
    .where('archiveId', r.matchers.uuid())
    .where('sourceId', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Unlink archive from source', tags: ['Archives'] });
}
