import type { MeasurementType } from '#shared/enums';

export interface MeasurementModel {
  measurementId: string;
  equipmentId: string | null;
  eventId: string | null;
  name: string;
  value: { toString(): string } | string | number;
  unit: string;
  measurementType: MeasurementType;
  context: string;
  measurementDate: Date | null;
  isApproximate: boolean;
  uncertainty: { toString(): string } | string | number | null;
  createdAt: Date;
  updatedAt?: Date;

  equipment?: {
    equipmentId: string;
    name: string;
    slug: string;
  } | null;

  event?: {
    eventId: string;
    title: string;
  } | null;

  sources?: Array<{
    sourceId: string;
    title?: string;
    url?: string;
    claimDescription?: string | null;
  }>;
}
