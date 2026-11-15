import dns from 'node:dns/promises';
import net from 'node:net';
import { AppException } from '#exceptions/app_exception';

const DISALLOWED_IPV4_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./,
  /^192\.0\.2\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^198\.(1[8-9])\./,
  /^224\./,
  /^240\./,
  /^255\.255\.255\.255$/,
];

export function isPrivateOrReservedIp(ip: string): boolean {
  const cleanIp = ip
    .replace(/^\[|\]$/g, '')
    .trim()
    .toLowerCase();

  if (cleanIp === '::1' || cleanIp === '::' || cleanIp === 'localhost') return true;

  if (cleanIp.includes(':')) {
    if (
      cleanIp.startsWith('fe8') ||
      cleanIp.startsWith('fe9') ||
      cleanIp.startsWith('fea') ||
      cleanIp.startsWith('feb')
    ) {
      return true;
    }
    if (cleanIp.startsWith('fc') || cleanIp.startsWith('fd')) {
      return true;
    }
    if (cleanIp.startsWith('ff')) {
      return true;
    }
    if (cleanIp.startsWith('2001:db8:')) {
      return true;
    }
    if (cleanIp.startsWith('::ffff:')) {
      const ipv4Part = cleanIp.replace('::ffff:', '');
      return isPrivateOrReservedIp(ipv4Part);
    }
    return false;
  }

  return DISALLOWED_IPV4_RANGES.some((regex) => regex.test(cleanIp));
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxSizeBytes?: number;
  maxRedirects?: number;
  allowedHosts?: string[];
}

export async function safeFetch(urlStr: string, options: SafeFetchOptions = {}): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const maxSizeBytes = options.maxSizeBytes ?? 1024 * 1024;
  const maxRedirects = options.maxRedirects ?? 3;

  let currentUrl = urlStr;
  let redirects = 0;

  while (redirects <= maxRedirects) {
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      throw AppException.badRequest('Invalid URL provided to safeFetch.');
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw AppException.badRequest(`Unsupported protocol '${parsed.protocol}'. Only http: and https: are permitted.`);
    }

    const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === 'https:' ? 443 : 80;
    if (port !== 80 && port !== 443) {
      throw AppException.badRequest(`Disallowed port '${port}'. Only ports 80 and 443 are allowed.`);
    }

    const cleanHost = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();

    if (options.allowedHosts && !options.allowedHosts.includes(cleanHost)) {
      throw AppException.badRequest(`Host '${cleanHost}' is not in the outbound allow-list.`);
    }

    if (cleanHost === 'localhost') {
      throw AppException.badRequest(`Target address 'localhost' is a forbidden host.`);
    }

    if (net.isIP(cleanHost)) {
      if (isPrivateOrReservedIp(cleanHost)) {
        throw AppException.badRequest(
          `Target address '${cleanHost}' resolves to a private or forbidden network range.`
        );
      }
    } else {
      let addresses: string[];
      try {
        const resolved = await dns.lookup(cleanHost, { all: true });
        addresses = resolved.map((r) => r.address);
      } catch {
        throw AppException.badRequest(`Could not resolve hostname '${cleanHost}'.`);
      }

      if (addresses.length === 0) {
        throw AppException.badRequest(`Could not resolve hostname '${cleanHost}'.`);
      }

      for (const address of addresses) {
        if (isPrivateOrReservedIp(address)) {
          throw AppException.badRequest(
            `Target address '${address}' resolves to a private or forbidden network range.`
          );
        }
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'User-Agent': 'SPACE-LEGACY-SafeFetch/1.0',
        },
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location');
        if (!location) {
          throw AppException.badRequest('Redirect response missing Location header.');
        }
        currentUrl = new URL(location, currentUrl).toString();
        redirects += 1;
        continue;
      }

      const contentLength = res.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
        throw AppException.payloadTooLarge(`Outbound response exceeded maximum size limit of ${maxSizeBytes} bytes.`);
      }

      return res;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw AppException.badRequest('Maximum redirect limit exceeded.');
}
