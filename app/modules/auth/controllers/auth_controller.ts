import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { authService, type AuthService } from '../services/auth_service.js';
import { authSerializer, type AuthSerializer } from '../serializers/auth_serializer.js';
import { authConfig } from '#config/auth';
import { appConfig } from '#config/app';
import type { LoginRequestDto, ChangePasswordRequestDto } from '../validators/auth.js';

export class AuthController {
  constructor(
    private readonly service: AuthService = authService,
    private readonly serializer: AuthSerializer = authSerializer
  ) {}

  login = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LoginRequestDto;
    const clientIp = (c.get('clientIp') as string) || '127.0.0.1';
    const userAgent = c.req.header('user-agent');
    const requestId = (c.get('requestId') as string) || 'unknown';

    const result = await this.service.login(body, { clientIp, userAgent, requestId });

    setCookie(c, authConfig.refreshToken.cookieName, result.rawRefreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production' || appConfig.isProduction,
      sameSite: 'Strict',
      path: authConfig.refreshToken.cookiePath,
      maxAge: authConfig.refreshToken.expiresInDays * 24 * 60 * 60,
    });

    const data = this.serializer.serializeLoginResponse(result.user, result.accessToken, result.expiresIn);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  refresh = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawRefreshToken = getCookie(c, authConfig.refreshToken.cookieName);
    const clientIp = (c.get('clientIp') as string) || '127.0.0.1';
    const userAgent = c.req.header('user-agent');
    const requestId = (c.get('requestId') as string) || 'unknown';

    const result = await this.service.refresh(rawRefreshToken, { clientIp, userAgent, requestId });

    setCookie(c, authConfig.refreshToken.cookieName, result.newRawRefreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production' || appConfig.isProduction,
      sameSite: 'Strict',
      path: authConfig.refreshToken.cookiePath,
      maxAge: authConfig.refreshToken.expiresInDays * 24 * 60 * 60,
    });

    const data = this.serializer.serializeRefreshResponse(result.accessToken, result.expiresIn);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  logout = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawRefreshToken = getCookie(c, authConfig.refreshToken.cookieName);

    await this.service.logout(rawRefreshToken);

    deleteCookie(c, authConfig.refreshToken.cookieName, {
      path: authConfig.refreshToken.cookiePath,
    });

    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Logged out successfully.' })
      : c.json({ success: true, data: { message: 'Logged out successfully.' } }, 200);
  };

  me = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const userId = c.get('userId') as string;
    const user = await this.service.getProfile(userId);
    const data = this.serializer.serializeUserProfile(user);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  changePassword = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const userId = c.get('userId') as string;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as ChangePasswordRequestDto;

    await this.service.changePassword(userId, body);

    deleteCookie(c, authConfig.refreshToken.cookieName, {
      path: authConfig.refreshToken.cookiePath,
    });

    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Password changed successfully. Existing sessions terminated.' })
      : c.json(
          { success: true, data: { message: 'Password changed successfully. Existing sessions terminated.' } },
          200
        );
  };
}

export const authController = new AuthController();
