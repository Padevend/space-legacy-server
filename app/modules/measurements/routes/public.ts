import type { Router } from '#infrastructure/http/router';
import { MeasurementController } from '../controllers/measurement_controller.js';
import {
  listMeasurementsQuerySchema,
  getMeasurementQuerySchema,
  measurementSchema,
} from '../validators/measurement.js';

export function registerMeasurementsPublicRoutes(router: Router): void {
  const r = router.forModule('measurements');

  r.get('/measurements', [MeasurementController, 'index'])
    .as('measurements.index')
    .validate({ query: listMeasurementsQuerySchema })
    .docs({
      summary: 'List scientific measurements and physical dimensions with filtering',
      tags: ['Measurements'],
      responses: { 200: 'List of measurements' },
    });

  r.get('/measurements/:id', [MeasurementController, 'show'])
    .as('measurements.show')
    .where('id', r.matchers.uuid())
    .validate({ query: getMeasurementQuerySchema })
    .docs({
      summary: 'Get single measurement by UUID with optional includes (equipment, event, sources)',
      tags: ['Measurements'],
      responses: { 200: measurementSchema, 404: 'NOT_FOUND' },
    });
}
