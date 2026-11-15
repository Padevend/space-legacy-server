# Threat Model

## System Overview
SPACE LEGACY delivers public educational content about historical NASA equipment while allowing authorized editors and administrators to ingest, author, and curate data.

## Assets & Trust Boundaries
1. **Public Domain Data**: Equipment history, coordinates, measurements, stories. Read-only, accessible by anyone.
2. **Editorial Content**: In-draft stories, unpublished media, administrative audit logs. Internal only.
3. **Internal Scraped Archives**: Raw scraped payloads (`Archive.rawContent`). Confidential and internal only.
4. **User Credentials & Sessions**: Password hashes (Argon2id), refresh token lineage records, JWT signing keys.

## Threat Assessment & Mitigations

### 1. Cross-Site Scripting (XSS)
- **Threat**: Attackers inject malicious scripts via equipment descriptions, story markdown, or URL fields.
- **Controls**: Strict input sanitization via `sanitize-html` stripping all tags for plain-text fields, URL protocol whitelisting (`http:`, `https:` only), `nosniff` header, and strict Content Security Policy (`default-src 'none'`).

### 2. Cross-Site Request Forgery (CSRF)
- **Threat**: Malicious websites induce browser actions on authenticated sessions.
- **Controls**: Short-lived Bearer tokens in memory for API requests; `SameSite=Strict` and path-scoped refresh cookies; Origin validation on state-changing requests; custom `X-CSRF-Token` header.

### 3. Server-Side Request Forgery (SSRF)
- **Threat**: Ingestion or URL validation processes dereferencing user-supplied links to access internal cloud metadata (`169.254.169.254`) or VPC networks.
- **Controls**: Strict zero-dereference rule for URLs by default; hardened `safeFetch` with private IP/loopback blacklisting if outbound requests are ever triggered.

### 4. SQL Injection
- **Threat**: Injection via search `q`, sort fields, or relation includes.
- **Controls**: Parameterized queries via Prisma; strict compile-time whitelists for sort fields; lint rule banning `$queryRawUnsafe` and `$executeRawUnsafe`.

### 5. Volumetric DDoS & Application Abuse
- **Threat**: Application exhaustion via unbounded query pagination, deep relation includes, or high-frequency requests.
- **Controls**: Multi-tier rate limiting (global, public, search, login, admin), request timeouts (15s), pagination caps (max 100), max 3 relation includes capped at 1 level depth.
- **Boundary Note**: Application-level limits cannot stop volumetric network DDoS; perimeter protection (reverse proxy, Cloudflare CDN, AWS Shield) is required in front.
