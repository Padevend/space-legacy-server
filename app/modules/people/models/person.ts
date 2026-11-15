export interface PersonModel {
  personId: string;
  fullName: string;
  biography: string | null;
  affiliation: string | null;
  createdAt: Date;
  updatedAt: Date;
}
