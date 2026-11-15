import type { Router } from '#infrastructure/http/router';
import { PersonController } from '../controllers/person_controller.js';
import { listPeopleQuerySchema, personSchema } from '../validators/person.js';

export function registerPeoplePublicRoutes(router: Router): void {
  const r = router.forModule('people');

  r.get('/people', [PersonController, 'index'])
    .as('people.index')
    .validate({ query: listPeopleQuerySchema })
    .docs({
      summary: 'List historical people, astronauts, and engineers',
      tags: ['People'],
      responses: { 200: 'List of people' },
    });

  r.get('/people/:id', [PersonController, 'show'])
    .as('people.show')
    .docs({
      summary: 'Get a person by UUID',
      tags: ['People'],
      responses: { 200: personSchema, 404: 'NOT_FOUND' },
    });
}
