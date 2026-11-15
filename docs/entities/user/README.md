# User Entity Contract

The `User` entity represents administrative and editorial back-office operators in the SPACE LEGACY system.

## 1. Roles & Permissions

- `ADMIN`: Full administrative control over users, equipment, missions, ingestion pipelines, and system configuration.
- `EDITOR`: Editorial content management (stories, media review, relation linking). Restricted from admin user management.

## 2. Security Controls

- **Argon2id Hashing:** Passwords hashed with RFC 9106 recommended parameters ($m=65536, t=3, p=4$).
- **Brute Force Protection:** 5 failed login attempts in 15 minutes triggers account lockout (`lockedUntil`).
- **Timing Equivalence:** Non-existent emails and wrong passwords execute constant-time dummy verification and yield identical error responses.
- **Refresh Token Family Rotation:** Refresh tokens rotate on every `/auth/refresh` request. Revoked token presentation immediately terminates the whole token family.
- **CSRF Protection:** State-changing cookie operations enforce CORS origin whitelisting and custom `X-CSRF-Token` headers.

## 3. Endpoints

- `POST /api/v1/auth/login` - Public
- `POST /api/v1/auth/refresh` - Protected with CSRF
- `POST /api/v1/auth/logout` - Protected with CSRF
- `GET /api/v1/auth/me` - Bearer Auth
- `POST /api/v1/auth/change-password` - Bearer Auth
- `GET /api/v1/admin/users` - Admin only
- `POST /api/v1/admin/users` - Admin only
- `GET /api/v1/admin/users/:id` - Admin only
- `PATCH /api/v1/admin/users/:id` - Admin only
- `DELETE /api/v1/admin/users/:id` - Admin only
