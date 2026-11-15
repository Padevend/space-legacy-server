export interface EquipmentPersonModel {
  equipmentId: string;
  personId: string;
  role: string | null;
  roleInEquipment?: string;
  createdAt?: Date;
}
