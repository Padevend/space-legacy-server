import type { Equipment } from '@prisma/client';
import type { EquipmentDto, EquipmentDetailDto } from './equipment.schemas.js';

export class EquipmentSerializer {
  serializeEquipment(equipment: Equipment): EquipmentDto {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeEquipmentDetail(equipment: any): EquipmentDetailDto {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: equipment.children.map((c: any) => ({
          equipmentId: c.equipmentId,
          name: c.name,
          slug: c.slug,
          equipmentType: c.equipmentType,
        })),
      }),
      ...(equipment.missions !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        missions: equipment.missions.map((m: any) => ({
          missionId: m.missionId,
          name: m.mission?.name ?? '',
          slug: m.mission?.slug ?? '',
          missionRole: m.missionRole,
        })),
      }),
      ...(equipment.locations !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locations: equipment.locations.map((loc: any) => ({
          equipmentLocationId: loc.equipmentLocationId,
          locationId: loc.locationId,
          name: loc.location?.name ?? '',
          latitude: loc.location?.latitude ? Number(loc.location.latitude) : null,
          longitude: loc.location?.longitude ? Number(loc.location.longitude) : null,
          startDate: loc.startDate ? loc.startDate.toISOString().split('T')[0] : null,
          endDate: loc.endDate ? loc.endDate.toISOString().split('T')[0] : null,
        })),
      }),
    };
  }
}

export const equipmentSerializer = new EquipmentSerializer();
