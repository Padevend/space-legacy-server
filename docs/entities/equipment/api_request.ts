import type { EquipmentType, OperationalStatus, PhysicalStatus } from './model.js';

export interface CreateEquipmentRequest {
  parentEquipmentId?: string | null | undefined;
  name: string;
  slug: string;
  description?: string | null | undefined;
  equipmentType: EquipmentType;
  manufacturer?: string | null | undefined;
  operationalStatus?: OperationalStatus | undefined;
  physicalStatus?: PhysicalStatus | undefined;
}

export interface UpdateEquipmentRequest {
  parentEquipmentId?: string | null | undefined;
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  equipmentType?: EquipmentType | undefined;
  manufacturer?: string | null | undefined;
  operationalStatus?: OperationalStatus | undefined;
  physicalStatus?: PhysicalStatus | undefined;
}

export interface LinkEquipmentLocationRequest {
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  locationPrecision?: 'EXACT' | 'ESTIMATED' | 'YEAR_ONLY' | 'MONTH_ONLY' | 'UNKNOWN' | undefined;
}

export interface LinkEquipmentPersonRequest {
  roleInEquipment: string;
}

export interface LinkEquipmentSourceRequest {
  claimDescription?: string | null | undefined;
}
