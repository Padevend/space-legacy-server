import type { EquipmentType, OperationalStatus, PhysicalStatus } from '#shared/enums';
import type { EquipmentPersonModel } from './equipment_person.js';

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
  people?: EquipmentPersonModel[];
  missions?: any[];
  locations?: any[];
  createdAt: Date;
  updatedAt: Date;
}
