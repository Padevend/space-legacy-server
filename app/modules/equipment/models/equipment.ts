import type { EquipmentType, OperationalStatus, PhysicalStatus } from '#shared/enums';

export interface EquipmentModel {
  equipmentId: string;
  parentEquipmentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  equipmentType: EquipmentType;
  manufacturer: string | null;
  operationalStatus: OperationalStatus;
  physicalStatus: PhysicalStatus;
  parent?: { equipmentId: string; name: string; slug: string } | null;
  children?: { equipmentId: string; name: string; slug: string; equipmentType: EquipmentType }[];
  missions?: any[];
  locations?: any[];
  createdAt: Date;
  updatedAt: Date;
}
