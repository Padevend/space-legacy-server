export interface SessionModel {
  id: string;
  visitorId: string;
  tokenHash: string;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
}
