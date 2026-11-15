export const EQUIPMENT_TYPES = [
  'SPACECRAFT',
  'LANDER',
  'ROVER',
  'ORBITER',
  'MODULE',
  'STAGE',
  'SCIENTIFIC_INSTRUMENT',
  'COMPONENT',
  'ARTIFACT',
  'OTHER',
] as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const OPERATIONAL_STATUSES = [
  'OPERATIONAL',
  'INACTIVE',
  'MISSION_ENDED',
  'FAILED',
  'UNKNOWN',
] as const;

export type OperationalStatus = (typeof OPERATIONAL_STATUSES)[number];

export const PHYSICAL_STATUSES = [
  'LEFT_ON_SURFACE',
  'IN_ORBIT',
  'RETURNED_TO_EARTH',
  'DESTROYED',
  'LOST',
  'UNKNOWN',
] as const;

export type PhysicalStatus = (typeof PHYSICAL_STATUSES)[number];

export interface Equipment {
  equipmentId: string;
  parentEquipmentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  equipmentType: EquipmentType;
  manufacturer: string | null;
  operationalStatus: OperationalStatus;
  physicalStatus: PhysicalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentParentRelation {
  equipmentId: string;
  name: string;
  slug: string;
}

export interface EquipmentChildRelation {
  equipmentId: string;
  name: string;
  slug: string;
  equipmentType: EquipmentType;
}

export interface EquipmentMissionRelation {
  missionId: string;
  name: string;
  slug: string;
  missionRole: string;
}

export interface EquipmentLocationRelation {
  equipmentLocationId: string;
  locationId: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface EquipmentDetail extends Equipment {
  parent?: EquipmentParentRelation | null;
  children?: EquipmentChildRelation[];
  missions?: EquipmentMissionRelation[];
  locations?: EquipmentLocationRelation[];
}
