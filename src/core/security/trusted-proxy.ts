import type { MiddlewareHandler } from 'hono';
import { securityConfig } from '../../../config/security.js';

function isIpInSubnet(ip: string, subnet: string): boolean {
  if (subnet === ip) return true;
  if (!subnet.includes('/')) return false;

  // Simple CIDR check for IPv4
  const [range, bitsStr] = subnet.split('/');
  if (!range || !bitsStr) return false;
  const bits = parseInt(bitsStr, 10);
  if (Number.isNaN(bits)) return false;

  const ipToInt = (addr: string) =>
    addr.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;

  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipToInt(ip) & mask) === (ipToInt(range) & mask);
}

function isTrusted(peerIp: string): boolean {
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
    // Get immediate peer IP (default from connection or socket)
    let peerIp = '127.0.0.1';
    const connInfo = (c.env as { incoming?: { socket?: { remoteAddress?: string } } })?.incoming?.socket?.remoteAddress;
    if (connInfo) {
      peerIp = connInfo.replace(/^::ffff:/, '');
    }

    let resolvedClientIp = peerIp;

    // Only inspect X-Forwarded-For if immediate peer is trusted
    if (isTrusted(peerIp)) {
      const xff = c.req.header('x-forwarded-for');
      if (xff) {
        const ips = xff.split(',').map((ip) => ip.trim().replace(/^::ffff:/, ''));
        // The first untrusted IP from the right or the first client IP on the left
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
