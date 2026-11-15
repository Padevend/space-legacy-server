# Auth Module

## Purpose
Manages back-office user authentication, credential verification, session token families with rotation and reuse detection, password change operations, and user administration. Implements the `UserResolver` contract for middleware.

## Owned Models
- `User`
- `RefreshToken`

## Endpoints
### Public:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Authenticated / Admin:
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/change-password`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users/:id`
- `PUT /api/v1/admin/users/:id`
- `DELETE /api/v1/admin/users/:id`
