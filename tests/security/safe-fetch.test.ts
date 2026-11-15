import { describe, it, expect, vi } from 'vitest';
import { safeFetch, isPrivateOrReservedIp } from '../../app/infrastructure/security/safe_fetch.js';
import { AppException } from '#exceptions/app_exception';

describe('Security: safeFetch (SSRF Protection)', () => {
  describe('isPrivateOrReservedIp', () => {
    it('identifies loopback addresses', () => {
      expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('127.255.255.255')).toBe(true);
      expect(isPrivateOrReservedIp('localhost')).toBe(true);
      expect(isPrivateOrReservedIp('::1')).toBe(true);
    });

    it('identifies RFC 1918 private IPv4 ranges', () => {
      expect(isPrivateOrReservedIp('10.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('10.255.255.255')).toBe(true);
      expect(isPrivateOrReservedIp('172.16.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('172.31.255.255')).toBe(true);
      expect(isPrivateOrReservedIp('192.168.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('192.168.1.100')).toBe(true);
    });

    it('identifies cloud metadata / link-local addresses', () => {
      expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
      expect(isPrivateOrReservedIp('169.254.1.1')).toBe(true);
    });

    it('identifies IPv6 link-local and unique local addresses (ULA)', () => {
      expect(isPrivateOrReservedIp('fe80::1')).toBe(true);
      expect(isPrivateOrReservedIp('fc00::1')).toBe(true);
      expect(isPrivateOrReservedIp('fd12:3456:789a:1::1')).toBe(true);
      expect(isPrivateOrReservedIp('ff02::1')).toBe(true); // Multicast
    });

    it('allows legitimate public IP addresses', () => {
      expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
      expect(isPrivateOrReservedIp('93.184.216.34')).toBe(false);
      expect(isPrivateOrReservedIp('140.82.121.4')).toBe(false);
    });
  });

  describe('safeFetch URL and Protocol Validation', () => {
    it('rejects unsupported protocols (file://, gopher://, ftp://)', async () => {
      await expect(safeFetch('file:///etc/passwd')).rejects.toThrow(AppException);
      await expect(safeFetch('gopher://example.com')).rejects.toThrow(AppException);
      await expect(safeFetch('ftp://example.com')).rejects.toThrow(AppException);
    });

    it('rejects non-standard ports (e.g. 22, 8080, 2375)', async () => {
      await expect(safeFetch('http://93.184.216.34:22')).rejects.toThrow(AppException);
      await expect(safeFetch('http://93.184.216.34:8080')).rejects.toThrow(AppException);
      await expect(safeFetch('https://93.184.216.34:2375')).rejects.toThrow(AppException);
    });

    it('rejects direct private IPs and localhost', async () => {
      await expect(safeFetch('http://127.0.0.1/')).rejects.toThrow(AppException);
      await expect(safeFetch('http://localhost/')).rejects.toThrow(AppException);
      await expect(safeFetch('http://169.254.169.254/latest/meta-data')).rejects.toThrow(AppException);
      await expect(safeFetch('http://10.0.0.1/')).rejects.toThrow(AppException);
      await expect(safeFetch('http://192.168.1.1/')).rejects.toThrow(AppException);
      await expect(safeFetch('http://[::1]/')).rejects.toThrow(AppException);
      await expect(safeFetch('http://[fe80::1]/')).rejects.toThrow(AppException);
    });

    it('enforces allowedHosts allow-list when configured', async () => {
      await expect(
        safeFetch('https://example.com', {
          allowedHosts: ['api.nasa.gov'],
        })
      ).rejects.toThrow('not in the outbound allow-list');
    });

    it('rejects redirects pointing to private or metadata addresses', async () => {
      // Mock global fetch to return a 302 redirect targeting cloud metadata
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => {
        return new Response(null, {
          status: 302,
          headers: { location: 'http://169.254.169.254/latest/meta-data/' },
        });
      });

      try {
        await expect(safeFetch('https://httpbin.org/redirect-to-metadata')).rejects.toThrow(
          "Target address '169.254.169.254' resolves to a private or forbidden network range."
        );
      } finally {
        fetchSpy.mockRestore();
      }
    });

    it('enforces maximum response size limit', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => {
        return new Response('x'.repeat(1000), {
          status: 200,
          headers: { 'content-length': '5000000' }, // 5MB
        });
      });

      try {
        await expect(safeFetch('https://httpbin.org/large', { maxSizeBytes: 1024 * 1024 })).rejects.toThrow(
          'Outbound response exceeded maximum size limit'
        );
      } finally {
        fetchSpy.mockRestore();
      }
    });
  });
});
