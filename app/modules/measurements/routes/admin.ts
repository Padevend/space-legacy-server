import type { Router } from '#infrastructure/http/router';
import { AdminMeasurementController } from '../controllers/admin_measurement_controller.js';
import { createMeasurementRequestSchema, updateMeasurementRequestSchema } from '../validators/measurement.js';
import { middleware } from '#start/kernel';

export function registerMeasurementsAdminRoutes(router: Router): void {
  const r = router.forModule('measurements');

  r.post('/admin/measurements', [AdminMeasurementController, 'store'])
    .as('admin.measurements.store')
    .use(middleware.ability('measurements:write'))
    .validate({ body: createMeasurementRequestSchema })
    .docs({
      summary: 'Create a new scientific measurement',
      tags: ['Measurements'],
      responses: { 201: 'Created measurement', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/measurements/:id', [AdminMeasurementController, 'update'])
    .as('admin.measurements.update')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('measurements:write'))
    .validate({ body: updateMeasurementRequestSchema })
    .docs({
      summary: 'Update an existing scientific measurement',
      tags: ['Measurements'],
      responses: { 200: 'Updated measurement', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/measurements/:id', [AdminMeasurementController, 'update'])
    .as('admin.measurements.patch')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('measurements:write'))
    .validate({ body: updateMeasurementRequestSchema })
    .docs({
      summary: 'Update an existing scientific measurement',
      tags: ['Measurements'],
      responses: { 200: 'Updated measurement', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/measurements/:id', [AdminMeasurementController, 'destroy'])
    .as('admin.measurements.destroy')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('measurements:delete'))
    .docs({
      summary: 'Delete a scientific measurement',
      tags: ['Measurements'],
      responses: { 200: 'Deleted measurement', 404: 'NOT_FOUND' },
    });
}
