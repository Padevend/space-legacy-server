import type { EventType, DatePrecision } from '#shared/enums';

export interface EventModel {
  eventId: string;
  missionId: string;
  title: string;
  description: string | null;
  eventType: EventType;
  eventDate: Date | null;
  eventTime: Date | null;
  timeStandard: string | null;
  datePrecision: DatePrecision;
  isEstimated: boolean;
  sequenceOrder: number;
  createdAt: Date;
  updatedAt?: Date;

  mission?: {
    missionId: string;
    name: string;
    slug: string;
  } | null;

  equipment?: Array<{
    equipmentId: string;
    name?: string;
    slug?: string;
    roleInEvent: string | null;
    description?: string | null;
  }>;

  locations?: Array<{
    locationId: string;
    name?: string;
    locationRole: string | null;
  }>;

  sources?: Array<{
    sourceId: string;
    title?: string;
    claimDescription?: string | null;
  }>;
}
