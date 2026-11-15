import type { EventType, DatePrecision } from './model.js';

export interface CreateEventRequest {
  missionId: string;
  title: string;
  description?: string | null | undefined;
  eventType: EventType;
  eventDate?: string | null | undefined;
  eventTime?: string | null | undefined;
  timeStandard?: string | null | undefined;
  datePrecision?: DatePrecision | undefined;
  isEstimated?: boolean | undefined;
  sequenceOrder?: number | undefined;
}

export interface UpdateEventRequest {
  missionId?: string | undefined;
  title?: string | undefined;
  description?: string | null | undefined;
  eventType?: EventType | undefined;
  eventDate?: string | null | undefined;
  eventTime?: string | null | undefined;
  timeStandard?: string | null | undefined;
  datePrecision?: DatePrecision | undefined;
  isEstimated?: boolean | undefined;
  sequenceOrder?: number | undefined;
}

export interface LinkEventEquipmentRequest {
  roleInEvent?: string | null | undefined;
  description?: string | null | undefined;
}

export interface LinkEventLocationRequest {
  locationRole?: string | null | undefined;
}

export interface LinkEventPersonRequest {
  roleInEvent: string;
}

export interface LinkEventSourceRequest {
  claimDescription?: string | null | undefined;
}
