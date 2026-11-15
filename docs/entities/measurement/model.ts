export const MEASUREMENT_TYPES = [
  'MASS',
  'DISTANCE',
  'DURATION',
  'TEMPERATURE',
  'FREQUENCY',
  'SPEED',
  'FORCE',
  'PRESSURE',
  'POWER',
  'VOLTAGE',
  'OTHER',
] as const;

export type MeasurementType = (typeof MEASUREMENT_TYPES)[number];

export interface Measurement {
  measurementId: string;
  equipmentId: string | null;
  eventId: string | null;
  name: string;
  value: string; // Exact string decimal (db.Decimal(24, 8)) to avoid IEEE 754 precision loss
  unit: string;
  measurementType: MeasurementType;
  context: string;
  measurementDate: string | null;
  isApproximate: boolean;
  uncertainty: string | null;
}

export interface MeasurementEquipmentRelation {
  equipmentId: string;
  name: string;
  slug: string;
}

export interface MeasurementEventRelation {
  eventId: string;
  title: string;
}

export interface MeasurementSourceRelation {
  sourceId: string;
  title: string;
  url: string;
  claimDescription: string | null;
}

export interface MeasurementDetail extends Measurement {
  equipment?: MeasurementEquipmentRelation | null;
  event?: MeasurementEventRelation | null;
  sources?: MeasurementSourceRelation[];
}
