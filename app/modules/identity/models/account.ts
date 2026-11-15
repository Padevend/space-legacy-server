import type { AccountRole } from '#shared/enums';

export interface AccountModel {
  id: string;
  visitorId: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: AccountRole;
  createdAt: Date;
  updatedAt: Date;
}
