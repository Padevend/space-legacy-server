import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { authService } from './auth.service.js';
import { authSerializer } from './auth.serializer.js';
import { ok } from '../../core/http/response.js';
import { authConfig } from '../../../config/auth.js';
import { appConfig } from '../../../config/app.js';
export class AuthController {
    service;
    serializer;
    constructor(service = authService, serializer = authSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    login = async (c) => {
        const body = (await c.req.json());
        const clientIp = c.get('clientIp') || '127.0.0.1';
        const userAgent = c.req.header('user-agent');
        const requestId = c.get('requestId') || 'unknown';
        const result = await this.service.login(body, { clientIp, userAgent, requestId });
        // Set refresh token in HttpOnly, SameSite=Strict cookie
        setCookie(c, authConfig.refreshToken.cookieName, result.rawRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || appConfig.isProduction,
            sameSite: 'Strict',
            path: authConfig.refreshToken.cookiePath,
            maxAge: authConfig.refreshToken.expiresInDays * 24 * 60 * 60,
        });
        const data = this.serializer.serializeLoginResponse(result.user, result.accessToken, result.expiresIn);
        return ok(c, data);
    };
    refresh = async (c) => {
        const rawRefreshToken = getCookie(c, authConfig.refreshToken.cookieName);
        const clientIp = c.get('clientIp') || '127.0.0.1';
        const userAgent = c.req.header('user-agent');
        const requestId = c.get('requestId') || 'unknown';
        const result = await this.service.refresh(rawRefreshToken, { clientIp, userAgent, requestId });
        // Rotate refresh token cookie
        setCookie(c, authConfig.refreshToken.cookieName, result.newRawRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || appConfig.isProduction,
            sameSite: 'Strict',
            path: authConfig.refreshToken.cookiePath,
            maxAge: authConfig.refreshToken.expiresInDays * 24 * 60 * 60,
        });
        const data = this.serializer.serializeRefreshResponse(result.accessToken, result.expiresIn);
        return ok(c, data);
    };
    logout = async (c) => {
        const rawRefreshToken = getCookie(c, authConfig.refreshToken.cookieName);
        const userId = c.get('userId');
        const requestId = c.get('requestId') || 'unknown';
        await this.service.logout(rawRefreshToken, userId, { requestId });
        // Clear refresh cookie
        deleteCookie(c, authConfig.refreshToken.cookieName, {
            path: authConfig.refreshToken.cookiePath,
        });
        return ok(c, { message: 'Logged out successfully.' });
    };
    me = async (c) => {
        const userId = c.get('userId');
        const user = await this.service.getProfile(userId);
        const data = this.serializer.serializeUserProfile(user);
        return ok(c, data);
    };
    changePassword = async (c) => {
        const userId = c.get('userId');
        const body = (await c.req.json());
        const requestId = c.get('requestId') || 'unknown';
        await this.service.changePassword(userId, body, { requestId });
        // Invalidate refresh cookie
        deleteCookie(c, authConfig.refreshToken.cookieName, {
            path: authConfig.refreshToken.cookiePath,
        });
        return ok(c, { message: 'Password changed successfully. Existing sessions terminated.' });
    };
}
export const authController = new AuthController();
