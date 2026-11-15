import { container } from '#infrastructure/container/container';
import { EquipmentRepository } from '../repositories/equipment_repository.js';
import { EquipmentService } from '../services/equipment_service.js';
import { EquipmentSerializer } from '../serializers/equipment_serializer.js';
import { EquipmentPolicy } from '../policies/equipment_policy.js';
import { EquipmentController } from '../controllers/equipment_controller.js';
import { AdminEquipmentController } from '../controllers/admin_equipment_controller.js';

export class EquipmentProvider {
  register(): void {
    const mod = container.forModule('equipment');

    mod.singleton(EquipmentRepository, () => new EquipmentRepository());
    mod.singleton(EquipmentSerializer, () => new EquipmentSerializer());
    mod.singleton(EquipmentPolicy, () => new EquipmentPolicy());
    mod.singleton(EquipmentService, () => new EquipmentService(mod.make(EquipmentRepository)));

    mod.bind(
      EquipmentController,
      () => new EquipmentController(mod.make(EquipmentService), mod.make(EquipmentSerializer))
    );
    mod.bind(
      AdminEquipmentController,
      () => new AdminEquipmentController(mod.make(EquipmentService), mod.make(EquipmentSerializer))
    );
  }
}

export const equipmentProvider = new EquipmentProvider();
