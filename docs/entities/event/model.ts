export const EVENT_TYPES = [
  'LAUNCH',
  'LANDING',
  'FLYBY',
  'ORBIT_INSERTION',
  'DEPLOYMENT',
  'ACTIVATION',
  'SCIENTIFIC_DISCOVERY',
  'COMMUNICATION',
  'LAST_SIGNAL',
  'MISSION_END',
  'OTHER',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const DATE_PRECISIONS = [
  'EXACT',
  'ESTIMATED',
  'YEAR_ONLY',
  'MONTH_ONLY',
  'UNKNOWN',
] as const;

export type DatePrecision = (typeof DATE_PRECISIONS)[number];

export interface Event {
  eventId: string;
  missionId: string;
  title: string;
  description: string | null;
  eventType: EventType;
  eventDate: string | null;
  eventTime: string | null;
  timeStandard: string | null;
  datePrecision: DatePrecision;
  isEstimated: boolean;
  sequenceOrder: number;
  createdAt: string;
}

export interface EventMissionRelation {
  missionId: string;
  name: string;
  slug: string;
}

export interface EventEquipmentRelation {
  equipmentId: string;
  name: string;
  slug: string;
  roleInEvent: string | null;
  description: string | null;
}

export interface EventLocationRelation {
  locationId: string;
  name: string;
  locationRole: string | null;
}

export interface EventPersonRelation {
  personId: string;
  fullName: string;
  roleInEvent: string | null;
}

export interface EventSourceRelation {
  sourceId: string;
  title: string;
  url: string;
  claimDescription: string | null;
}

export interface EventDetail extends Event {
  mission?: EventMissionRelation;
  equipment?: EventEquipmentRelation[];
  locations?: EventLocationRelation[];
  people?: EventPersonRelation[];
  sources?: EventSourceRelation[];
}
