import { container } from '#infrastructure/container/container';
import { MeasurementRepository } from '../repositories/measurement_repository.js';
import { MeasurementService } from '../services/measurement_service.js';
import { MeasurementSerializer } from '../serializers/measurement_serializer.js';
import { MeasurementPolicy } from '../policies/measurement_policy.js';
import { MeasurementController } from '../controllers/measurement_controller.js';
import { AdminMeasurementController } from '../controllers/admin_measurement_controller.js';

export class MeasurementProvider {
  register(): void {
    const mod = container.forModule('measurements');

    mod.singleton(MeasurementRepository, () => new MeasurementRepository());
    mod.singleton(MeasurementSerializer, () => new MeasurementSerializer());
    mod.singleton(MeasurementPolicy, () => new MeasurementPolicy());
    mod.singleton(MeasurementService, () => new MeasurementService(mod.make(MeasurementRepository)));

    mod.bind(
      MeasurementController,
      () => new MeasurementController(mod.make(MeasurementService), mod.make(MeasurementSerializer))
    );
    mod.bind(
      AdminMeasurementController,
      () => new AdminMeasurementController(mod.make(MeasurementService), mod.make(MeasurementSerializer))
    );
  }
}

export const measurementProvider = new MeasurementProvider();
