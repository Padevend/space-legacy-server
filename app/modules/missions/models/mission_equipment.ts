export interface MissionEquipmentModel {
  missionId: string;
  equipmentId: string;
  missionRole: string;
  role?: string | null;
  participationDescription?: string | null;
  createdAt?: Date;
}
