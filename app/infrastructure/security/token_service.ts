import { SignJWT, jwtVerify } from 'jose';
import crypto from 'node:crypto';
import { authConfig } from '#config/auth';
import { AppException } from '#exceptions/app_exception';
import type { UserRole } from '#shared/enums';

export interface JwtAccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

const secretKey = new TextEncoder().encode(authConfig.jwt.secret);

export async function signAccessToken(payload: JwtAccessTokenPayload): Promise<string> {
  const jti = crypto.randomUUID();

  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: authConfig.jwt.algorithm, typ: 'JWT' })
    .setSubject(payload.userId)
    .setIssuer(authConfig.jwt.issuer)
    .setAudience(authConfig.jwt.audience)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${authConfig.jwt.expiresInSeconds}s`)
    .sign(secretKey);
}

export async function verifyAccessToken(token: string): Promise<JwtAccessTokenPayload> {
  try {
    const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience,
      algorithms: [authConfig.jwt.algorithm],
    });

    if (protectedHeader.alg !== authConfig.jwt.algorithm) {
      throw AppException.unauthenticated('Invalid token algorithm.');
    }

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw AppException.unauthenticated('Invalid token subject.');
    }

    const email = payload['email'];
    const role = payload['role'];

    if (typeof email !== 'string' || (role !== 'ADMIN' && role !== 'EDITOR')) {
      throw AppException.unauthenticated('Invalid token claims.');
    }

    return {
      userId: payload.sub,
      email,
      role: role as UserRole,
    };
  } catch (error) {
    if (error instanceof AppException) throw error;
    throw AppException.unauthenticated('Invalid, expired or tampered access token.');
  }
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashOpaqueToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
