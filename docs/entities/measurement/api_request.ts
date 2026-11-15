import type { MeasurementType } from './model.js';

export interface CreateMeasurementRequest {
  equipmentId?: string | null | undefined;
  eventId?: string | null | undefined;
  name: string;
  value: string;
  unit: string;
  measurementType: MeasurementType;
  context: string;
  measurementDate?: string | null | undefined;
  isApproximate?: boolean | undefined;
  uncertainty?: string | null | undefined;
}

export interface UpdateMeasurementRequest {
  equipmentId?: string | null | undefined;
  eventId?: string | null | undefined;
  name?: string | undefined;
  value?: string | undefined;
  unit?: string | undefined;
  measurementType?: MeasurementType | undefined;
  context?: string | undefined;
  measurementDate?: string | null | undefined;
  isApproximate?: boolean | undefined;
  uncertainty?: string | null | undefined;
}

export interface LinkMeasurementSourceRequest {
  claimDescription?: string | null | undefined;
}
