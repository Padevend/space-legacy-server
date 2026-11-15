export const MISSION_STATUSES = [
  'PLANNED',
  'ACTIVE',
  'COMPLETED',
  'PARTIALLY_COMPLETED',
  'FAILED',
  'UNKNOWN',
] as const;

export type MissionStatus = (typeof MISSION_STATUSES)[number];

export interface Mission {
  missionId: string;
  name: string;
  slug: string;
  description: string | null;
  agency: string | null;
  missionStatus: MissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MissionEquipmentRelation {
  equipmentId: string;
  name: string;
  slug: string;
  missionRole: string;
  participationDescription: string | null;
}

export interface MissionPersonRelation {
  personId: string;
  fullName: string;
  roleInMission: string;
}

export interface MissionSourceRelation {
  sourceId: string;
  title: string;
  url: string;
  claimDescription: string | null;
}

export interface MissionDetail extends Mission {
  equipment?: MissionEquipmentRelation[];
  people?: MissionPersonRelation[];
  sources?: MissionSourceRelation[];
}
