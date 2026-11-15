import type { MissionStatus } from '#shared/enums';
import type { MissionEquipmentModel } from './mission_equipment.js';
import type { MissionPersonModel } from './mission_person.js';

export interface MissionModel {
  missionId: string;
  name: string;
  slug: string;
  description: string | null;
  agency: string | null;
  missionStatus: MissionStatus;
  equipment?: any[];
  people?: any[];
  sources?: any[];
  createdAt: Date;
  updatedAt: Date;
}
