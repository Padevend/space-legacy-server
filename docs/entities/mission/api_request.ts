import type { MissionStatus } from './model.js';

export interface CreateMissionRequest {
  name: string;
  slug: string;
  description?: string | null | undefined;
  agency?: string | null | undefined;
  missionStatus?: MissionStatus | undefined;
}

export interface UpdateMissionRequest {
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  agency?: string | null | undefined;
  missionStatus?: MissionStatus | undefined;
}

export interface LinkMissionPersonRequest {
  roleInMission: string;
}

export interface LinkMissionSourceRequest {
  claimDescription?: string | null | undefined;
}

export interface LinkMissionEquipmentRequest {
  missionRole: string;
  participationDescription?: string | null | undefined;
}
