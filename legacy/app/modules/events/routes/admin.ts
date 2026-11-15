import type { Router } from '#infrastructure/http/router';
import { AdminEventController } from '../controllers/admin_event_controller.js';
import {
  createEventRequestSchema,
  updateEventRequestSchema,
  linkEventEquipmentSchema,
  linkEventLocationSchema,
} from '../validators/event.js';
import { middleware } from '#start/kernel';

export function registerEventsAdminRoutes(router: Router): void {
  const r = router.forModule('events');

  r.post('/admin/events', [AdminEventController, 'store'])
    .as('admin.events.store')
    .use(middleware.ability('events:write'))
    .validate({ body: createEventRequestSchema })
    .docs({
      summary: 'Create a new timeline event',
      tags: ['Events'],
      responses: { 201: 'Created event', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/events/:id', [AdminEventController, 'update'])
    .as('admin.events.update')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .validate({ body: updateEventRequestSchema })
    .docs({
      summary: 'Update an existing timeline event',
      tags: ['Events'],
      responses: { 200: 'Updated event', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/events/:id', [AdminEventController, 'update'])
    .as('admin.events.patch')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .validate({ body: updateEventRequestSchema })
    .docs({
      summary: 'Update an existing timeline event',
      tags: ['Events'],
      responses: { 200: 'Updated event', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/events/:id', [AdminEventController, 'destroy'])
    .as('admin.events.destroy')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('events:delete'))
    .docs({
      summary: 'Delete a timeline event',
      tags: ['Events'],
      responses: { 200: 'Deleted event', 404: 'NOT_FOUND' },
    });

  // Relations
  r.post('/admin/events/:eventId/equipment/:equipmentId', [AdminEventController, 'linkEquipment'])
    .as('admin.events.linkEquipment')
    .where('eventId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .validate({ body: linkEventEquipmentSchema })
    .docs({ summary: 'Link equipment to event with participation role', tags: ['Events'] });

  r.put('/admin/events/:eventId/equipment/:equipmentId', [AdminEventController, 'linkEquipment'])
    .as('admin.events.linkEquipmentPut')
    .where('eventId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .docs({ summary: 'Link equipment to event with participation role', tags: ['Events'] });

  r.delete('/admin/events/:eventId/equipment/:equipmentId', [AdminEventController, 'unlinkEquipment'])
    .as('admin.events.unlinkEquipment')
    .where('eventId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .docs({ summary: 'Unlink equipment from event', tags: ['Events'] });

  r.post('/admin/events/:eventId/locations/:locationId', [AdminEventController, 'linkLocation'])
    .as('admin.events.linkLocation')
    .where('eventId', r.matchers.uuid())
    .where('locationId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .validate({ body: linkEventLocationSchema })
    .docs({ summary: 'Link location to event with location role', tags: ['Events'] });

  r.put('/admin/events/:eventId/locations/:locationId', [AdminEventController, 'linkLocation'])
    .as('admin.events.linkLocationPut')
    .where('eventId', r.matchers.uuid())
    .where('locationId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .docs({ summary: 'Link location to event with location role', tags: ['Events'] });

  r.delete('/admin/events/:eventId/locations/:locationId', [AdminEventController, 'unlinkLocation'])
    .as('admin.events.unlinkLocation')
    .where('eventId', r.matchers.uuid())
    .where('locationId', r.matchers.uuid())
    .use(middleware.ability('events:write'))
    .docs({ summary: 'Unlink location from event', tags: ['Events'] });
}
