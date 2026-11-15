import type { DatePrecision } from '#shared/enums';
import type { LocationModel } from './location.js';

export interface EquipmentLocationModel {
  equipmentLocationId: string;
  equipmentId: string;
  locationId: string;
  startDate: Date | null;
  endDate: Date | null;
  locationPrecision: DatePrecision;
  location?: LocationModel | undefined;
}
