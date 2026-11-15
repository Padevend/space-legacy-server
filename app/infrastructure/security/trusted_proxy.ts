import type { MiddlewareHandler } from 'hono';
import { securityConfig } from '#config/security';

export function isIpInSubnet(ip: string, subnet: string): boolean {
  if (subnet === ip) return true;
  if (!subnet.includes('/')) return false;

  const [range, bitsStr] = subnet.split('/');
  if (!range || !bitsStr) return false;
  const bits = parseInt(bitsStr, 10);
  if (Number.isNaN(bits)) return false;

  const ipToInt = (addr: string) => addr.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;

  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipToInt(ip) & mask) === (ipToInt(range) & mask);
}

export function isTrusted(peerIp: string): boolean {
  return securityConfig.trustedProxies.some((trusted) => {
    if (trusted === peerIp) return true;
    if (trusted.includes('/')) {
      return isIpInSubnet(peerIp, trusted);
    }
    return false;
  });
}

export const trustedProxyMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const envObj = c.env as
      | {
          remoteAddress?: string;
          incoming?: { socket?: { remoteAddress?: string } };
          server?: { incoming?: { socket?: { remoteAddress?: string } } };
        }
      | undefined;

    let peerIp =
      envObj?.remoteAddress ??
      envObj?.server?.incoming?.socket?.remoteAddress ??
      envObj?.incoming?.socket?.remoteAddress ??
      '127.0.0.1';

    peerIp = peerIp.replace(/^::ffff:/, '');

    let resolvedClientIp = peerIp;

    if (isTrusted(peerIp)) {
      const xff = c.req.header('x-forwarded-for');
      if (xff) {
        const ips = xff.split(',').map((ip) => ip.trim().replace(/^::ffff:/, ''));
        const clientCandidate = ips[0];
        if (clientCandidate) {
          resolvedClientIp = clientCandidate;
        }
      }
    }

    c.set('clientIp', resolvedClientIp);
    await next();
  };
};
