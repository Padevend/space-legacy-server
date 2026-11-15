import type { Router } from '#infrastructure/http/router';
import { EventController } from '../controllers/event_controller.js';
import { listEventsQuerySchema, getEventQuerySchema, eventSchema } from '../validators/event.js';

export function registerEventsPublicRoutes(router: Router): void {
  const r = router.forModule('events');

  r.get('/events', [EventController, 'index'])
    .as('events.index')
    .validate({ query: listEventsQuerySchema })
    .docs({
      summary: 'List historical space exploration events with pagination and filtering',
      tags: ['Events'],
      responses: { 200: 'List of events' },
    });

  r.get('/events/:id', [EventController, 'show'])
    .as('events.show')
    .where('id', r.matchers.uuid())
    .validate({ query: getEventQuerySchema })
    .docs({
      summary: 'Get single event by UUID with optional includes (mission, equipment, locations, people, sources)',
      tags: ['Events'],
      responses: { 200: eventSchema, 404: 'NOT_FOUND' },
    });
}
