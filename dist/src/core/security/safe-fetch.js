import dns from 'node:dns/promises';
import net from 'node:net';
import { AppException } from '../exceptions/AppException.js';
const DISALLOWED_IPV4_RANGES = [
    /^127\./, // Loopback
    /^10\./, // RFC1918 Class A
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // RFC1918 Class B
    /^192\.168\./, // RFC1918 Class C
    /^169\.254\./, // Link-local / Cloud metadata (AWS, GCP, Azure: 169.254.169.254)
    /^0\./, // Current network
    /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Carrier-grade NAT (RFC 6598)
    /^192\.0\.2\./, // Documentation (TEST-NET-1)
    /^198\.51\.100\./, // Documentation (TEST-NET-2)
    /^203\.0\.113\./, // Documentation (TEST-NET-3)
    /^198\.(1[8-9])\./, // Benchmarking
    /^224\./, // Multicast
    /^240\./, // Reserved
    /^255\.255\.255\.255$/, // Broadcast
];
export function isPrivateOrReservedIp(ip) {
    const cleanIp = ip
        .replace(/^\[|\]$/g, '')
        .trim()
        .toLowerCase();
    if (cleanIp === '::1' || cleanIp === '::' || cleanIp === 'localhost')
        return true;
    // IPv6 checks
    if (cleanIp.includes(':')) {
        if (cleanIp.startsWith('fe8') ||
            cleanIp.startsWith('fe9') ||
            cleanIp.startsWith('fea') ||
            cleanIp.startsWith('feb')) {
            return true; // Link-local (fe80::/10)
        }
        if (cleanIp.startsWith('fc') || cleanIp.startsWith('fd')) {
            return true; // Unique local (ULA fc00::/7)
        }
        if (cleanIp.startsWith('ff')) {
            return true; // Multicast (ff00::/8)
        }
        if (cleanIp.startsWith('2001:db8:')) {
            return true; // Documentation
        }
        if (cleanIp.startsWith('::ffff:')) {
            const ipv4Part = cleanIp.replace('::ffff:', '');
            return isPrivateOrReservedIp(ipv4Part);
        }
        return false;
    }
    // IPv4 checks
    return DISALLOWED_IPV4_RANGES.some((regex) => regex.test(cleanIp));
}
export async function safeFetch(urlStr, options = {}) {
    const timeoutMs = options.timeoutMs ?? 5000;
    const maxSizeBytes = options.maxSizeBytes ?? 1024 * 1024; // 1MB
    const maxRedirects = options.maxRedirects ?? 3;
    let currentUrl = urlStr;
    let redirects = 0;
    while (redirects <= maxRedirects) {
        let parsed;
        try {
            parsed = new URL(currentUrl);
        }
        catch {
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
        // If host is directly an IP literal
        if (net.isIP(cleanHost)) {
            if (isPrivateOrReservedIp(cleanHost)) {
                throw AppException.badRequest(`Target address '${cleanHost}' resolves to a private or forbidden network range.`);
            }
        }
        else {
            // Resolve DNS
            let addresses;
            try {
                const resolved = await dns.lookup(cleanHost, { all: true });
                addresses = resolved.map((r) => r.address);
            }
            catch {
                throw AppException.badRequest(`Could not resolve hostname '${cleanHost}'.`);
            }
            if (addresses.length === 0) {
                throw AppException.badRequest(`Could not resolve hostname '${cleanHost}'.`);
            }
            for (const address of addresses) {
                if (isPrivateOrReservedIp(address)) {
                    throw AppException.badRequest(`Target address '${address}' resolves to a private or forbidden network range.`);
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
            // Handle redirects with re-validation
            if (res.status >= 300 && res.status < 400) {
                const location = res.headers.get('location');
                if (!location) {
                    throw AppException.badRequest('Redirect response missing Location header.');
                }
                currentUrl = new URL(location, currentUrl).toString();
                redirects += 1;
                continue;
            }
            // Check content size
            const contentLength = res.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
                throw AppException.payloadTooLarge(`Outbound response exceeded maximum size limit of ${maxSizeBytes} bytes.`);
            }
            return res;
        }
        finally {
            clearTimeout(timeout);
        }
    }
    throw AppException.badRequest('Maximum redirect limit exceeded.');
}
