import { container } from '#infrastructure/container/container';
import { MissionRepository } from '../repositories/mission_repository.js';
import { MissionService } from '../services/mission_service.js';
import { MissionSerializer } from '../serializers/mission_serializer.js';
import { MissionPolicy } from '../policies/mission_policy.js';
import { MissionController } from '../controllers/mission_controller.js';
import { AdminMissionController } from '../controllers/admin_mission_controller.js';

export class MissionProvider {
  register(): void {
    const mod = container.forModule('missions');

    mod.singleton(MissionRepository, () => new MissionRepository());
    mod.singleton(MissionSerializer, () => new MissionSerializer());
    mod.singleton(MissionPolicy, () => new MissionPolicy());
    mod.singleton(MissionService, () => new MissionService(mod.make(MissionRepository)));

    mod.bind(MissionController, () => new MissionController(mod.make(MissionService), mod.make(MissionSerializer)));
    mod.bind(
      AdminMissionController,
      () => new AdminMissionController(mod.make(MissionService), mod.make(MissionSerializer))
    );
  }
}

export const missionProvider = new MissionProvider();
