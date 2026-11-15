import type { EquipmentModel } from '../models/equipment.js';
import type { EquipmentDto, EquipmentDetailDto } from '../validators/equipment.js';

export class EquipmentSerializer {
  serializeEquipment(equipment: EquipmentModel): EquipmentDto {
    return {
      equipmentId: equipment.equipmentId,
      parentEquipmentId: equipment.parentEquipmentId ?? null,
      name: equipment.name,
      slug: equipment.slug,
      description: equipment.description ?? null,
      equipmentType: equipment.equipmentType,
      manufacturer: equipment.manufacturer ?? null,
      operationalStatus: equipment.operationalStatus,
      physicalStatus: equipment.physicalStatus,
      createdAt: equipment.createdAt.toISOString(),
      updatedAt: equipment.updatedAt.toISOString(),
    };
  }

  serializeEquipmentDetail(equipment: EquipmentModel): EquipmentDetailDto {
    const base = this.serializeEquipment(equipment);

    return {
      ...base,
      ...(equipment.parent !== undefined && {
        parent: equipment.parent
          ? {
              equipmentId: equipment.parent.equipmentId,
              name: equipment.parent.name,
              slug: equipment.parent.slug,
            }
          : null,
      }),
      ...(equipment.children !== undefined && {
        children: equipment.children.map((c) => ({
          equipmentId: c.equipmentId,
          name: c.name,
          slug: c.slug,
          equipmentType: c.equipmentType,
        })),
      }),
      ...(equipment.missions !== undefined && {
        missions: equipment.missions.map((m) => ({
          missionId: m.missionId,
          name: m.name,
          slug: m.slug,
          missionRole: m.missionRole,
        })),
      }),
      ...(equipment.locations !== undefined && {
        locations: equipment.locations.map((loc) => ({
          equipmentLocationId: loc.equipmentLocationId,
          locationId: loc.locationId,
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          startDate: loc.startDate,
          endDate: loc.endDate,
        })),
      }),
    };
  }
}

export const equipmentSerializer = new EquipmentSerializer();
