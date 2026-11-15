import type { MissionModel } from '../models/mission.js';
import type { MissionDto, MissionDetailDto } from '../validators/mission.js';
import type { MissionEquipmentModel } from '../models/mission_equipment.js';

export class MissionSerializer {
  serializeMission(mission: MissionModel): MissionDto {
    return {
      missionId: mission.missionId,
      name: mission.name,
      slug: mission.slug,
      description: mission.description ?? null,
      agency: mission.agency ?? null,
      missionStatus: mission.missionStatus,
      createdAt: mission.createdAt.toISOString(),
      updatedAt: mission.updatedAt.toISOString(),
    };
  }

  serializeMissionDetail(mission: MissionModel): MissionDetailDto {
    const base = this.serializeMission(mission);

    return {
      ...base,
      ...(mission.equipment !== undefined && {
        equipment: mission.equipment.map((e) => ({
          equipmentId: e.equipmentId,
          name: e.name,
          slug: e.slug,
          missionRole: e.missionRole,
          participationDescription: e.participationDescription ?? null,
          role: e.role,
        })),
      }),
      ...(mission.sources !== undefined && {
        sources: mission.sources.map((s) => ({
          sourceId: s.sourceId,
          title: s.title,
          url: s.url,
          claimDescription: s.claimDescription ?? null,
        })),
      }),
    };
  }

  serializeMissionEquipment(link: MissionEquipmentModel) {
    return {
      missionId: link.missionId,
      equipmentId: link.equipmentId,
      missionRole: link.missionRole,
      role: link.role ?? link.missionRole,
      participationDescription: link.participationDescription ?? null,
      ...(link.createdAt && { createdAt: link.createdAt.toISOString() }),
    };
  }
}

export const missionSerializer = new MissionSerializer();
