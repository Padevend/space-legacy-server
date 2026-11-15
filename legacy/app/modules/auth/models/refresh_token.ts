export interface RefreshTokenModel {
  refreshTokenId: string;
  tokenHash: string;
  userId: string;
  familyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedById: string | null;
  userAgentHash: string | null;
  createdAt: Date;
}
