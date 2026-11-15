import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { identityService, IdentityService } from '../services/identity_service.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  deleteAccountSchema,
} from '../validators/identity.js';
import { jsonSuccess } from '#shared/http';
import { UnauthorizedError } from '#shared/errors';

export class IdentityController {
  private service: IdentityService;

  constructor(service?: IdentityService) {
    this.service = service instanceof IdentityService ? service : identityService;
  }

  private extractBearerToken(c: Context): string | undefined {
    const authHeader = c.req.header('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim();
    }
    return undefined;
  }

  anonymousSession = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawToken = this.extractBearerToken(c);
    const result = await this.service.getOrCreateAnonymousSession(rawToken);
    return jsonSuccess(c, result);
  };

  register = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = (c.get('visitorId') as string | undefined) ?? '';
    const body = await c.req.json();
    const input = registerSchema.parse(body);

    const result = await this.service.register(visitorId, input);
    return jsonSuccess(c, result, 201);
  };

  login = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const currentVisitorId = c.get('visitorId') as string | undefined;
    const body = await c.req.json();
    const input = loginSchema.parse(body);

    const result = await this.service.login(input, currentVisitorId);
    return jsonSuccess(c, result);
  };

  logout = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawToken = this.extractBearerToken(c);
    if (rawToken) {
      await this.service.logout(rawToken);
    }
    return jsonSuccess(c, { success: true });
  };

  me = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Session required.');
    }

    const result = await this.service.getMe(visitorId);
    return jsonSuccess(c, result);
  };

  updateProfile = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Authentication required.');
    }

    const body = await c.req.json();
    const input = updateProfileSchema.parse(body);

    const account = await this.service.updateProfile(visitorId, input);
    return jsonSuccess(c, { account });
  };

  updatePassword = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Authentication required.');
    }

    const body = await c.req.json();
    const input = updatePasswordSchema.parse(body);

    const result = await this.service.updatePassword(visitorId, input);
    return jsonSuccess(c, result);
  };

  deleteAccount = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const visitorId = c.get('visitorId') as string | undefined;
    if (!visitorId) {
      throw new UnauthorizedError('Authentication required.');
    }

    const body = await c.req.json();
    const input = deleteAccountSchema.parse(body);

    const result = await this.service.deleteAccount(visitorId, input);
    return jsonSuccess(c, result);
  };
}

export const identityController = new IdentityController();
