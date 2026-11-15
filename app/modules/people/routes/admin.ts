import type { Router } from '#infrastructure/http/router';
import { AdminPersonController } from '../controllers/admin_person_controller.js';
import { createPersonRequestSchema, updatePersonRequestSchema } from '../validators/person.js';
import { middleware } from '#start/kernel';

export function registerPeopleAdminRoutes(router: Router): void {
  const r = router.forModule('people');

  r.post('/admin/people', [AdminPersonController, 'store'])
    .as('admin.people.store')
    .use(middleware.ability('people:write'))
    .validate({ body: createPersonRequestSchema })
    .docs({
      summary: 'Create a new person record',
      tags: ['People'],
      responses: { 201: 'Created person', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/people/:id', [AdminPersonController, 'update'])
    .as('admin.people.update')
    .use(middleware.ability('people:write'))
    .validate({ body: updatePersonRequestSchema })
    .docs({
      summary: 'Update an existing person record',
      tags: ['People'],
      responses: { 200: 'Updated person', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/people/:id', [AdminPersonController, 'update'])
    .as('admin.people.patch')
    .use(middleware.ability('people:write'))
    .validate({ body: updatePersonRequestSchema })
    .docs({
      summary: 'Update an existing person record',
      tags: ['People'],
      responses: { 200: 'Updated person', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/people/:id', [AdminPersonController, 'destroy'])
    .as('admin.people.destroy')
    .use(middleware.ability('people:delete'))
    .docs({
      summary: 'Delete a person record',
      tags: ['People'],
      responses: { 200: 'Deleted person', 404: 'NOT_FOUND' },
    });
}
